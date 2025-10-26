import logging

logger = logging.getLogger(__name__)

class MobileCompatibilityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        response = self.get_response(request)

        # Debug logging for media requests
        if request.path.startswith('/media/'):
            logger.info(f"Processing media request: {request.path}")

        # Add mobile-friendly headers
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, Accept-Language, Cache-Control, Origin, User-Agent, cache-control'
        response['Access-Control-Max-Age'] = '86400'
        response['Access-Control-Allow-Credentials'] = 'true'

        # Add security headers for mobile
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'

        # Add CSP headers to allow ngrok fonts and media files
        response['Content-Security-Policy'] = "default-src 'self' https://cdn.ngrok.com 'unsafe-eval' 'unsafe-inline'; font-src 'self' https://assets.ngrok.com data:; img-src 'self' data: https: http://localhost:* http://127.0.0.1:*; style-src 'self' 'unsafe-inline' https:; media-src 'self' http://localhost:* http://127.0.0.1:* https:;"

        # Handle preflight requests
        if request.method == 'OPTIONS':
            response.status_code = 200
            response.content = b''

        return response 