from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    
    def ready(self):
        """Import and register signals when app is ready"""
        try:
            import api.signals  # noqa
        except ImportError:
            pass
