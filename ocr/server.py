from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Tuple
from PIL import Image, ImageFile
import numpy as np
import cv2, base64, io, re
from paddleocr import PaddleOCR

# Allow loading partially transmitted images
ImageFile.LOAD_TRUNCATED_IMAGES = True

app = FastAPI(title="GenjiPK OCR")

# --------- PaddleOCR (warm load) ----------
OCR = PaddleOCR(
    use_angle_cls=True,
    lang="en",
    det_model_dir=None,   # builtin v4
    rec_model_dir=None,
    show_log=False
)

# --------- ROIs (x1,y1,x2,y2) 16:9 HUD on ----------
ROI_TOPLEFT        = [0.010, 0.020, 0.360, 0.300]   # MADE BY / MAP CODE / TIME / SPLIT
ROI_TOPLEFT_WIDE   = [0.005, 0.010, 0.420, 0.340]
ROI_BANNER_TIGHT   = [0.220, 0.180, 0.780, 0.360]   # “…MISSION COMPLETE! TIME … SEC”
ROI_TOPRIGHT       = [0.800, 0.170, 0.985, 0.470]   # “TOP 5 … SEC …”
ROI_BOTTOMLEFT     = [0.050, 0.825, 0.330, 0.990]   # player name near hero HUD


# ==================== utils ====================
def _fix_b64_padding(s: str) -> str:
    s = re.sub(r"\s+", "", s)
    # URL-safe -> standard
    s = s.replace("-", "+").replace("_", "/")
    s = s.replace(" ", "+")
    # pad to multiple of 4
    missing = (-len(s)) % 4
    if missing:
        s += "=" * missing
    return s


def decode_b64(img_b64: str) -> np.ndarray:
    if not img_b64:
        raise HTTPException(status_code=400, detail="image_b64 is required")

    img_b64 = img_b64.strip()
    if "," in img_b64 and img_b64.lower().startswith("data:"):
        img_b64 = img_b64.split(",", 1)[1]

    img_b64 = _fix_b64_padding(img_b64)

    try:
        raw = base64.b64decode(img_b64, validate=False)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"invalid base64: {e}")

    try:
        img = Image.open(io.BytesIO(raw))
        img.load()
        img = img.convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"invalid image stream: {e}")

    return cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)


def crop_norm(img: np.ndarray, roi: List[float]) -> np.ndarray:
    h, w = img.shape[:2]
    x1 = max(int(w * roi[0]), 0)
    y1 = max(int(h * roi[1]), 0)
    x2 = min(int(w * roi[2]), w)
    y2 = min(int(h * roi[3]), h)
    return img[y1:y2, x1:x2].copy()


def clahe_gray(img: np.ndarray) -> np.ndarray:
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    g = clahe.apply(g)
    g = cv2.GaussianBlur(g, (3, 3), 0)
    return g


def emphasize_white(img: np.ndarray) -> np.ndarray:
    """HSV mask that emphasizes white (banner/white text)."""
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    low  = np.array([0, 0, 190], dtype=np.uint8)
    high = np.array([179, 60, 255], dtype=np.uint8)
    m = cv2.inRange(hsv, low, high)
    m = cv2.medianBlur(m, 3)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8), iterations=1)
    return m


def emphasize_cyan(img: np.ndarray) -> np.ndarray:
    """HSV mask that emphasizes cyan (top-left cyan text)."""
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    low  = np.array([80, 50, 120], dtype=np.uint8)    # ~cyan
    high = np.array([105, 255, 255], dtype=np.uint8)
    m = cv2.inRange(hsv, low, high)
    m = cv2.medianBlur(m, 3)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8), iterations=1)
    return m


def ocr_text(img: np.ndarray) -> List[Tuple[str, float]]:
    """Always return a list of (text, confidence). Never None."""
    if img is None or img.size == 0:
        return []

    # PaddleOCR expects BGR; if mask/grayscale -> convert.
    if len(img.shape) == 2:
        src = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    else:
        src = img

    try:
        result = OCR.ocr(src, cls=True) or []
    except Exception:
        return []

    lines: List[Tuple[str, float]] = []

    # Typical structure: [ [ [box, (text, score)], ... ] ]
    blocks = result[0] if (len(result) > 0 and isinstance(result[0], list)) else result

    for item in (blocks or []):
        if not item or len(item) < 2:
            continue
        info = item[1]  # (text, score)
        if not isinstance(info, (list, tuple)) or len(info) < 2:
            continue
        txt = str(info[0] or "").strip()
        try:
            conf = float(info[1]) if info[1] is not None else -1.0
        except Exception:
            conf = -1.0
        if txt:
            lines.append((txt, conf))

    return lines


def join_lines(lines: List[Tuple[str, float]]) -> str:
    return " ".join([t for t, _ in lines]).strip()


def clean_code(s: Optional[str]) -> Optional[str]:
    if not s:
        return None
    # Very common OCR confusion O -> 0
    s = s.upper().replace("O", "0")
    s = re.sub(r"[^A-Z0-9]", "", s)
    if 4 <= len(s) <= 6:
        return s
    return None


# ==================== Time / Name parsing ====================
def _digits_loose_to_float(token: str) -> Optional[float]:
    if not token:
        return None
    t = token.upper()
    # Common OCR replacements
    t = (t.replace('O', '0').replace('Q', '0').replace('D', '0')
            .replace('I', '1').replace('L', '1')
            .replace('S', '5').replace('B', '8')
            .replace('Z', '2').replace('G', '6'))
    # 1,234.56 -> 1234.56 ; 1873,60 -> 1873.60
    t = re.sub(r'[^\d\.,]', '', t)
    t = t.replace(',', '.')
    m = re.search(r'(\d{1,5}\.\d{2})', t)
    if not m:
        return None
    try:
        return float(m.group(1))
    except Exception:
        return None

def _norm_banner_text(s: str) -> str:
    s = (s or "").upper()
    # Light normalizations for OCR confusions
    s = s.replace("T1ME", "TIME").replace("TLME", "TIME").replace("TI ME", "TIME")
    s = s.replace("5EC", "SEC").replace("SE€", "SEC").replace("SEL", "SEC")
    s = re.sub(r"\s+", " ", s).strip()
    return s


def _numbers_around(idx: int, text: str, radius: int = 40) -> str:
    """Return a slice of text around an index (used as a local window)."""
    if idx < 0:
        return text
    a = max(0, idx)
    b = min(len(text), idx + radius)
    return text[a:b]


def parse_banner_time_robust(banner_text: str) -> Optional[float]:
    if not banner_text:
        return None
    s = (banner_text or '').upper()
    # Normalizations around TIME/SEC and variants
    s = (s.replace('T1ME','TIME').replace('TLME','TIME')
           .replace('TI ME','TIME').replace('5EC','SEC')
           .replace('SE€','SEC').replace('SEL','SEC'))
    s = re.sub(r'\s+', ' ', s).strip()

    # 1) Window after TIME (priority)
    i = s.find('TIME')
    if i != -1:
        win = s[i:i+80]
        # e.g. "3488.10", "3488,10", "348B.1O", with optional unit (SEC/초)
        m = re.search(r'([0-9OQDBZGISL\,\.]{3,12})\s*(?:SEC|초)?', win)
        if m:
            v = _digits_loose_to_float(m.group(1))
            if v is not None:
                return v

    # 2) Anywhere in the banner, score proximity to TIME/SEC/초
    best = None
    for m in re.finditer(r'([0-9OQDBZGISL\,\.]{3,12})', s):
        cand = _digits_loose_to_float(m.group(1))
        if cand is None:
            continue
        j = m.start()
        score = 0
        if i != -1 and 0 <= (j - i) <= 80:
            score += 2
        tail = s[m.end(): m.end()+8]
        if re.search(r'(SEC|초)', tail):
            score += 1
        if best is None or score > best[0]:
            best = (score, cand)
    return best[1] if best else None


def name_from_banner(banner_text: str) -> Optional[str]:
    m = re.search(r"([A-Z][A-Z0-9_]{3,24})\s+MISSION\s+COMPLETE", (banner_text or "").upper())
    return m.group(1) if m else None


def name_from_bottomleft(bl_text: str) -> Optional[str]:
    m = re.search(r"\b([A-Z][A-Z0-9_]{3,24})\b", (bl_text or "").upper())
    return m.group(1) if m else None


def parse_top5_name_time(topright_text: str) -> Tuple[Optional[str], Optional[float]]:
    """Extract (name, time) from the TOP 5 block."""
    txt = (topright_text or "").upper()
    j = txt.find("TOP 5")
    if j != -1:
        txt = txt[j:j+180]

    m = re.search(r"TOP\s*5.*?\b([A-Z][A-Z0-9_]{2,24})\b.*?(\d{1,4}[.,]\d{2})\s*SEC", txt)
    if not m:
        # Permissive fallback if 'TOP 5' was missed
        m = re.search(r"\b([A-Z][A-Z0-9_]{2,24})\b.*?(\d{1,4}[.,]\d{2})\s*SEC", txt)
    if m:
        name = m.group(1)
        try:
            t = float(m.group(2).replace(",", "."))
        except Exception:
            t = None
        return name, t
    return None, None


def names_equal(a: Optional[str], b: Optional[str]) -> bool:
    if not a or not b:
        return False
    return a.strip().upper() == b.strip().upper()


def extract_time_secure(banner_text: str, topright_text: str, bl_text: str) -> Optional[float]:
    """
    1) Try the banner first (robust).
    2) If it fails (None), allow TOP 5 time only if TOP5 name
       == bottom-left name AND (if available) == banner name.
    """
    banner_time = parse_banner_time_robust(banner_text)
    if banner_time is not None:
        return banner_time  # absolute priority to the banner

    banner_name = name_from_banner(banner_text)
    bl_name     = name_from_bottomleft(bl_text)
    tr_name, tr_time = parse_top5_name_time(topright_text)

    ok_bl = names_equal(tr_name, bl_name)
    ok_bn = True if (banner_name is None) else names_equal(tr_name, banner_name)

    if tr_time is not None and ok_bl and ok_bn:
        return tr_time

    return None


# ==================== Code & Name parsing ====================
def extract_code(tl_text: str, tl_white_text: str, tl_cyan_text: str) -> Optional[str]:
    # Concatenate and normalize to reduce OCR confusions
    all_text = " ".join([tl_text or "", tl_white_text or "", tl_cyan_text or ""]).upper()

    # Normalize frequent variants around "MAP CODE"
    norm = all_text
    norm = norm.replace("MAPCODE", "MAP CODE")
    norm = norm.replace("MAPC0DE", "MAP CODE")
    norm = re.sub(r"MAP\s+C0DE", "MAP CODE", norm)
    norm = re.sub(r"MAP\s+COOE", "MAP CODE", norm)   # 0/O swapped
    norm = re.sub(r"MAP\s+LODE", "MAP CODE", norm)   # C→L
    norm = re.sub(r"MAP\s+L0DE", "MAP CODE", norm)

    # 1) Strict pattern: MAP (C(O|0)?DE) : 4–6 alphanum
    m = re.search(r"MAP\s*(?:C(?:O|0)?DE)\s*[:\-]?\s*([A-Z0-9]{4,6})\b", norm)
    if m:
        return clean_code(m.group(1))

    # 2) If "MAP" is present, only search nearby (avoid matching "MADE BY")
    i = norm.find("MAP")
    if i != -1:
        window = norm[i:i+80]  # short window after "MAP"
        m2 = re.search(r"(?:C(?:O|0)?DE)\s*[:\-]?\s*([A-Z0-9]{4,6})\b", window)
        if m2:
            return clean_code(m2.group(1))
        t = re.search(r"\b([A-Z0-9]{4,6})\b", window)
        if t:
            token = t.group(1)
            if token not in {"MADE", "BY", "TIME", "SEC", "SPLIT", "LEVEL", "TOP", "PLAYTEST"}:
                return clean_code(token)

    # 3) Last resort: scan all 4–6 tokens, skipping common distractors
    for token in re.findall(r"\b[A-Z0-9]{4,6}\b", norm):
        if token in {"MADE", "BY", "TIME", "SEC", "SPLIT", "LEVEL", "TOP", "PLAYTEST"}:
            continue
        return clean_code(token)

    return None


def extract_name(banner_text: str, bl_text: str, topright_text: str) -> Optional[str]:
    m = re.search(r"([A-Z][A-Z0-9_]{3,24})\s+MISSION\s+COMPLETE", (banner_text or "").upper())
    if m:
        return m.group(1)
    m = re.search(r"\b([A-Z][A-Z0-9_]{3,24})\b", (bl_text or "").upper())
    if m:
        return m.group(1)
    m = re.search(r"\b([A-Z][A-Z0-9_]{3,24})\b", (topright_text or "").upper())
    if m:
        return m.group(1)
    return None


# ==================== API ====================
class B64(BaseModel):
    image_b64: str


@app.get("/ping")
def ping():
    return {"ok": True}


@app.post("/extract")
def extract(payload: B64):
    # --- decode image (explicit HTTP 4xx errors) ---
    try:
        img = decode_b64(payload.image_b64)
    except HTTPException as e:
        # Re-raise to let FastAPI respond with the proper HTTP status.
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"unexpected decode error: {e}")

    # --- crops ---
    tl  = crop_norm(img, ROI_TOPLEFT)
    tlw = crop_norm(img, ROI_TOPLEFT_WIDE)
    ban = crop_norm(img, ROI_BANNER_TIGHT)
    tr  = crop_norm(img, ROI_TOPRIGHT)
    bl  = crop_norm(img, ROI_BOTTOMLEFT)

    # --- color-aware masks ---
    tl_white_mask = emphasize_white(tlw)
    tl_cyan_mask  = emphasize_cyan(tlw)
    ban_white     = emphasize_white(ban)
    ban_gray = clahe_gray(ban)
    ban_bin  = cv2.adaptiveThreshold(
        ban_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 9
    )

    # --- OCR runs ---
    lines_ban   = ocr_text(ban)
    lines_banW  = ocr_text(emphasize_white(ban))
    lines_banB  = ocr_text(ban_bin)
    lines_tr    = ocr_text(tr)
    lines_bl    = ocr_text(bl)
    lines_tl    = ocr_text(tl)
    lines_tlw   = ocr_text(tlw)
    lines_tlWm  = ocr_text(tl_white_mask) if tl_white_mask is not None else []
    lines_tlCm  = ocr_text(tl_cyan_mask)  if tl_cyan_mask  is not None else []

    # --- texts ---
    text_ban  = join_lines(lines_ban + lines_banW + lines_banB)
    text_tr   = join_lines(lines_tr)
    text_bl   = join_lines(lines_bl)
    text_tl   = join_lines(lines_tl + lines_tlw)
    text_tlW  = join_lines(lines_tlWm)
    text_tlC  = join_lines(lines_tlCm)

    # --- parse ---
    sec  = extract_time_secure(text_ban, text_tr, text_bl)
    code = extract_code(text_tl, text_tlW, text_tlC)
    name = extract_name(text_ban, text_bl, text_tr)

    return {
        "extracted": {
            "name": name,
            "time": sec,
            "code": code,
            "texts": {
                "topLeft": text_tl,
                "topLeftWhite": text_tlW,
                "topLeftCyan": text_tlC,
                "banner": text_ban,
                "topRight": text_tr,
                "bottomLeft": text_bl
            }
        }
    }

#docker compose -f docker-compose.dev.yml build --no-cache ocr
#docker compose -f docker-compose.dev.yml up -d ocr
#docker compose -f docker-compose.dev.yml logs -f ocr