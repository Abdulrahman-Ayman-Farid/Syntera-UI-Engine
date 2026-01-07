# Use official Python runtime as base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY mcp-server.py .
COPY start.sh .

# Make start.sh executable
RUN chmod +x start.sh

# Expose port for MCP server
EXPOSE 3002

# Run startup script
CMD ["/bin/bash", "start.sh"]
