from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PlaylistViewSet, 
    VideoViewSet, 
    login_view, 
    logout_view, 
    check_auth_view
)

router = DefaultRouter()
router.register(r'playlists', PlaylistViewSet, basename='playlist')
router.register(r'videos', VideoViewSet, basename='video')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/check/', check_auth_view, name='check-auth'),
]
