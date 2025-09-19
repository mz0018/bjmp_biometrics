# Use official Python image
FROM python:3.8-slim
# Set working directory
WORKDIR /app

# Install git and other dependencies
RUN apt-get update && apt-get install -y git libgl1 && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir --no-deps --no-build-isolation -r requirements.txt

# Copy the rest of the code
COPY . .

# Expose FastAPI port (5001)
EXPOSE 5001

# Start FastAPI app
CMD ["python", "-m", "uvicorn", "main:app", "--reload", "--port", "5001"]