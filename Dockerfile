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

# Copy project
COPY . /app/

# Create logs directory
RUN mkdir -p /app/logs

# Collect static files (skip in build, do at runtime)
# RUN python manage.py collectstatic --noinput --settings=travel_agency.settings_production

# Ensure media directory has correct permissions before creating user
RUN mkdir -p /app/media && chmod 755 /app/media

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Create startup script to handle permissions and migrations
RUN echo '#!/bin/bash\n\
# Ensure media directory exists and has correct permissions\n\
mkdir -p /app/media\n\
chmod 755 /app/media\n\
\n\
# Run migrations\n\
python manage.py migrate\n\
\n\
# Collect static files\n\
python manage.py collectstatic --noinput\n\
\n\
# Start gunicorn\n\
exec gunicorn travel_agency.wsgi:application --bind 0.0.0.0:8000 --workers 4 --worker-class gevent --worker-connections 1000' > /app/start.sh

# Set permissions for startup script
RUN chmod +x /app/start.sh && chown appuser:appuser /app/start.sh

# Run the startup script
CMD ["/app/start.sh"]
