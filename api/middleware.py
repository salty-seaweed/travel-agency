class MobileCompatibilityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Add mobile-friendly headers
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept, Accept-Language, Cache-Control, Origin, User-Agent'
        response['Access-Control-Max-Age'] = '86400'
        response['Access-Control-Allow-Credentials'] = 'true'
        
        # Add security headers for mobile
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        
        # Handle preflight requests
        if request.method == 'OPTIONS':
            response.status_code = 200
            response.content = b''
        
        return response 