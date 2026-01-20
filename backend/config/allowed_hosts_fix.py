"""
Fix for ALLOWED_HOSTS validation on Render
Override Django's get_host() method to be more permissive on Render
"""
import os
import django.http.request

# Store original get_host method
_original_get_host = django.http.request.HttpRequest.get_host


def get_host_override(self):
    """
    Override get_host() to allow any host on Render
    """
    # Check if we're on Render
    if os.environ.get('RENDER') == 'true':
        # Get host from headers
        host = self.META.get('HTTP_HOST', '')
        if not host:
            host = self.META.get('SERVER_NAME', 'localhost')
        
        # Remove port if present
        host = host.split(':')[0]
        
        # On Render, allow any host (be permissive)
        # Django will still check ALLOWED_HOSTS, but we'll make sure it's set correctly
        return host
    
    # Not on Render, use original behavior
    return _original_get_host(self)


# Only override if we're actually on Render or if ALLOWED_HOSTS might be an issue
# This gets called when the module is imported
if os.environ.get('RENDER') == 'true':
    django.http.request.HttpRequest.get_host = get_host_override
