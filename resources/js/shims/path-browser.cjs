// Minimal browser-safe shim for Node's "path" module.
// OverPy mainly needs path.parse() in browser builds.

function toPosix(input) {
  return String(input || "").replace(/\\/g, "/");
}

function parse(input) {
  const raw = toPosix(input);
  const isAbs = raw.startsWith("/");
  const trimmed = raw.replace(/\/+$/, "");
  const slash = trimmed.lastIndexOf("/");
  const base = slash >= 0 ? trimmed.slice(slash + 1) : trimmed;
  const dir = slash >= 0 ? trimmed.slice(0, slash) || (isAbs ? "/" : "") : "";
  const dot = base.lastIndexOf(".");
  const hasExt = dot > 0;
  const ext = hasExt ? base.slice(dot) : "";
  const name = hasExt ? base.slice(0, dot) : base;
  const root = isAbs ? "/" : "";
  return { root, dir, base, ext, name };
}

function basename(input, suffix) {
  let base = parse(input).base;
  if (suffix && base.endsWith(suffix)) {
    base = base.slice(0, -suffix.length);
  }
  return base;
}

function dirname(input) {
  return parse(input).dir || ".";
}

function extname(input) {
  return parse(input).ext;
}

function normalize(input) {
  const raw = toPosix(input);
  const isAbs = raw.startsWith("/");
  const stack = [];
  for (const part of raw.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") {
      if (stack.length && stack[stack.length - 1] !== "..") stack.pop();
      else if (!isAbs) stack.push("..");
      continue;
    }
    stack.push(part);
  }
  const out = (isAbs ? "/" : "") + stack.join("/");
  return out || (isAbs ? "/" : ".");
}

function join() {
  return normalize([].slice.call(arguments).map(toPosix).join("/"));
}

function resolve() {
  let out = "";
  for (const part of [].slice.call(arguments)) {
    const chunk = toPosix(part);
    if (!chunk) continue;
    if (chunk.startsWith("/")) out = chunk;
    else out = out ? `${out}/${chunk}` : chunk;
  }
  return normalize(out || ".");
}

module.exports = {
  sep: "/",
  delimiter: ":",
  parse,
  basename,
  dirname,
  extname,
  normalize,
  join,
  resolve,
};

