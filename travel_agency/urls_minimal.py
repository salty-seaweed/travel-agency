from django.contrib import admin
from django.urls import path
from api.minimal_views import health_check, api_root

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/', api_root, name='api_root'),
    path('', api_root, name='home'),  # Root URL
]
