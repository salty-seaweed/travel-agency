FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project with .dockerignore optimizations
COPY . /app/

# Create directories and set permissions before creating user (faster)
RUN mkdir -p /app/logs /app/media && \
    chmod 755 /app/media

# Create non-root user and set ownership efficiently
RUN groupadd -r appuser && useradd --no-log-init -r -g appuser appuser && \
    chown -R appuser:appuser /app

USER appuser

# Expose port
EXPOSE 8000

# Optimized startup command
CMD ["sh", "-c", "python manage.py migrate && python manage.py collectstatic --noinput --clear && gunicorn travel_agency.wsgi:application --bind 0.0.0.0:$PORT --workers 3 --worker-class gevent --worker-connections 1000 --access-logfile - --error-logfile -"]
