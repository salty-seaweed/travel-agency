# Multi-stage build for optimized image size and faster exports
FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Create non-root user with home directory
RUN groupadd -r appuser && \
    useradd --no-log-init -r -g appuser -d /home/appuser -m appuser && \
    mkdir -p /home/appuser && \
    chown -R appuser:appuser /home/appuser

# Set work directory
WORKDIR /app

# Change ownership of work directory to appuser
RUN chown -R appuser:appuser /app

# Switch to appuser for package installation
USER appuser

# Install Python dependencies (this layer will be cached if requirements.txt doesn't change)
COPY --chown=appuser:appuser requirements.txt .
RUN pip install --no-cache-dir --user --no-warn-script-location -r requirements.txt

# Switch back to root for production stage setup
USER root

# Production stage
FROM python:3.11-slim as production

# Copy environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/home/appuser/.local/bin:$PATH" \
    PYTHONPATH="/home/appuser/.local/lib/python3.11/site-packages:$PYTHONPATH"

# Install only runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        postgresql-client \
        libpq5 \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && apt-get clean

# Create non-root user with home directory
RUN groupadd -r appuser && \
    useradd --no-log-init -r -g appuser -d /home/appuser -m appuser && \
    mkdir -p /home/appuser && \
    chown -R appuser:appuser /home/appuser

# Set work directory
WORKDIR /app

# Copy Python packages from base stage to appuser accessible location
COPY --from=base --chown=appuser:appuser /home/appuser/.local /home/appuser/.local

# Copy application code with optimizations
COPY --chown=appuser:appuser . .

# Create necessary directories with proper permissions
RUN mkdir -p /app/logs /app/media /app/staticfiles && \
    chmod 755 /app/media /app/staticfiles /app/logs && \
    chown -R appuser:appuser /app /home/appuser

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health/', timeout=5)" || exit 1

# Optimized startup script
RUN echo '#!/bin/bash\n\
set -e\n\
echo "🚀 Starting Railway deployment..."\n\
\n\
# Handle media directory permissions (Railway volume mounting)\n\
echo "📁 Setting up media directory..."\n\
mkdir -p /app/media\n\
# Try to set permissions, but don'\''t fail if volume is mounted\n\
chmod 755 /app/media 2>/dev/null || {
    echo "⚠️  Could not set media permissions (volume mounted)"
    echo "📂 Trying alternative: chmod a+X /app"
    chmod a+X /app 2>/dev/null || echo "⚠️  Parent directory permissions failed"
    echo "🔧 Trying: find /app -type d -exec chmod a+X {} \\;"
    find /app -type d -exec chmod a+X {} \; 2>/dev/null || echo "⚠️  Directory permissions failed"
}\n\
\n\
# Run migrations\n\
echo "📦 Running database migrations..."\n\
python manage.py migrate --verbosity=1\n\
\n\
# Collect static files\n\
echo "🎨 Collecting static files..."\n\
python manage.py collectstatic --noinput --clear --verbosity=1\n\
\n\
# Start gunicorn\n\
echo "🌐 Starting Gunicorn server..."\n\
exec gunicorn travel_agency.wsgi:application \
  --bind "0.0.0.0:${PORT:-8000}" \
  --workers 3 \
  --worker-class gevent \
  --worker-connections 1000 \
  --max-requests 1000 \
  --max-requests-jitter 50 \
  --access-logfile - \
  --error-logfile - \
  --log-level info \
  --timeout 30 \
  --keep-alive 10' > /app/start.sh && chmod +x /app/start.sh

# Set ownership of startup script
RUN chown appuser:appuser /app/start.sh

# Final startup command
CMD ["/app/start.sh"]
