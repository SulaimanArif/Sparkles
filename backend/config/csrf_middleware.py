"""
Custom CSRF middleware to exempt API endpoints from CSRF protection
"""
from django.utils.deprecation import MiddlewareMixin
from django.views.decorators.csrf import csrf_exempt


class CSRFExemptAPIMiddleware(MiddlewareMixin):
    """
    Middleware to exempt /api/ endpoints from CSRF protection
    since we're using token authentication
    """
    
    def process_request(self, request):
        # Exempt API endpoints from CSRF
        if request.path.startswith('/api/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
        return None
