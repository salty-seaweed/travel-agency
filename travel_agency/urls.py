"""
URL configuration for travel_agency project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app import views
    2. Add a URL to urlpatterns:  path('', views.Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.http import JsonResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def health_check(request):
    """Simple health check endpoint for Railway monitoring"""
    return JsonResponse({'status': 'healthy', 'timestamp': settings.TIME_ZONE})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('health/', health_check, name='health_check'),
]

# Serve media files in both development and production
if settings.DEBUG:
    # Development: Django serves media files
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # Production: Custom media serving for Railway
    urlpatterns += [
        path('media/<path:path>', serve, {
            'document_root': settings.MEDIA_ROOT,
            'show_indexes': False,
        }),
    ]
