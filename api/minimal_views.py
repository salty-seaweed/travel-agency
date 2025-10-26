from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """Simple health check endpoint"""
    return JsonResponse({
        'status': 'ok',
        'message': 'Django is running successfully!',
        'timestamp': str(request.META.get('HTTP_X_FORWARDED_FOR', 'local'))
    })

@csrf_exempt
@require_http_methods(["GET"])
def api_root(request):
    """Simple API root endpoint"""
    return JsonResponse({
        'message': 'Thread Travels API',
        'status': 'running',
        'endpoints': [
            '/api/health/',
            '/api/',
            '/admin/'
        ]
    })
