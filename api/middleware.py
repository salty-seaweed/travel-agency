import logging

logger = logging.getLogger(__name__)

class MobileCompatibilityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log incoming requests for debugging - especially package creation
        if request.path.startswith('/api/packages') and request.method in ['POST', 'PUT']:
            logger.info("=== API REQUEST RECEIVED ===")
            logger.info(f"Method: {request.method}")
            logger.info(f"Path: {request.path}")
            logger.info(f"Content-Type: {request.META.get('CONTENT_TYPE', 'Not set')}")
            logger.info(f"Content-Length: {request.META.get('CONTENT_LENGTH', 'Not set')}")
            logger.info(f"User-Agent: {request.META.get('HTTP_USER_AGENT', 'Not set')[:100]}")
            logger.info(f"Authorization: {'Present' if request.META.get('HTTP_AUTHORIZATION') else 'Not present'}")
            logger.info(f"Remote Address: {request.META.get('REMOTE_ADDR', 'Unknown')}")

            if request.body:
                try:
                    body_str = request.body.decode('utf-8')
                    logger.info(f"Request body length: {len(body_str)}")
                    logger.info(f"Request body preview: {body_str[:300]}...")
                except Exception as e:
                    logger.error(f"Could not decode request body: {e}")
                    logger.info(f"Raw body length: {len(request.body)}")

        response = self.get_response(request)

        # Log response for debugging
        if request.path.startswith('/api/packages') and request.method in ['POST', 'PUT']:
            logger.info(f"Response status: {response.status_code}")
            if hasattr(response, 'content'):
                try:
                    content_str = response.content.decode('utf-8')
                    logger.info(f"Response content preview: {content_str[:200]}...")
                except:
                    logger.info("Response content not decodable")

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

        # Add CSP headers to allow ngrok fonts
        response['Content-Security-Policy'] = "default-src 'self' https://cdn.ngrok.com 'unsafe-eval' 'unsafe-inline'; font-src 'self' https://assets.ngrok.com data:; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:;"

        # Handle preflight requests
        if request.method == 'OPTIONS':
            response.status_code = 200
            response.content = b''

        return response 