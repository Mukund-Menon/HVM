# HVM_Backend/Dockerfile
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

# # Install system dependencies
# RUN apt-get update && apt-get install -y \
#     gcc \
#     python3-dev \
#     && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt requests

# Create directory for SQLite database
RUN mkdir -p /app/db

# Copy project files
COPY . .

# Move SQLite database to persistent volume location
RUN if [ -f db.sqlite3 ]; then mv db.sqlite3 /app/db/; fi

# Create static directory
RUN mkdir -p /app/static

# Copy and set up entrypoint script
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

EXPOSE 8000

# Run entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]
