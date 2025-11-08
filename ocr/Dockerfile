FROM python:3.10-slim

WORKDIR /app

ENV FLAGS_use_mkldnn=1 \
    ONEDNN_MAX_CPU_ISA=AVX2 \
    DNNL_MAX_CPU_ISA=AVX2 \
    OMP_NUM_THREADS=1 \
    OPENBLAS_NUM_THREADS=1 \
    MKL_NUM_THREADS=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    libstdc++6 \
    wget \
    curl \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get clean

COPY requirements.txt .

RUN pip install --no-cache-dir paddlepaddle==2.6.1

RUN pip install --no-cache-dir -r requirements.txt

COPY server.py .

EXPOSE 8000
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]