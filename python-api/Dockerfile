# Use official Python image
FROM python:3.8-slim

# Set working directory
WORKDIR /app

# Install apt deps required by some Python packages (OpenCV, ffmpeg etc.)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      git \
      libgl1 \
      libglib2.0-0 \
      libsm6 \
      libxext6 \
      libxrender1 \
      ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (cache-friendly)
COPY requirements.txt ./

# Install CPU-only PyTorch wheels (CPU build avoids CUDA libs)
RUN pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu \
    torch torchvision torchaudio

# Install the rest of your Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app source
COPY . .

# Expose FastAPI port
EXPOSE 5001

# Start FastAPI
CMD ["python", "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "5001"]
