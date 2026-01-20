"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from pathlib import Path
from .views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# Serve static files
react_build_dir = Path(settings.BASE_DIR).parent / 'frontend' / 'dist'

# Always serve React build assets at /assets/ path (for both dev and production)
if react_build_dir.exists():
    assets_dir = react_build_dir / 'assets'
    if assets_dir.exists():
        urlpatterns += [
            re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': assets_dir}),
        ]

# Serve static files in development
if settings.DEBUG:
    if react_build_dir.exists():
        urlpatterns += static(settings.STATIC_URL, document_root=react_build_dir)
    if settings.STATIC_ROOT.exists():
        urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Serve React App - catch-all for non-API/admin/static/assets routes
urlpatterns += [
    re_path(r'^(?!api|admin|static|assets).*$', index, name='index'),
]
