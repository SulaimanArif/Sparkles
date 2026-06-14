from django.contrib import admin
from .models import Playlist, Video, ChatMessage


@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at', 'updated_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'playlist', 'youtube_id', 'added_at', 'order']
    list_filter = ['playlist', 'added_at']
    search_fields = ['title', 'youtube_id']
    ordering = ['order', '-added_at']


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['user', 'content', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content', 'user__username']
    ordering = ['-created_at']
