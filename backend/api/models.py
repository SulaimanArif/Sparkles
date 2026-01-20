from django.db import models
import re


def extract_youtube_id(url):
    """Extract YouTube video ID from various URL formats."""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


class Playlist(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Video(models.Model):
    title = models.CharField(max_length=300, blank=True)
    youtube_url = models.URLField()
    youtube_id = models.CharField(max_length=50)
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name='videos')
    thumbnail_url = models.URLField(blank=True)
    added_at = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', '-added_at']

    def save(self, *args, **kwargs):
        # Extract YouTube ID if not already set
        if not self.youtube_id and self.youtube_url:
            self.youtube_id = extract_youtube_id(self.youtube_url) or ''
        
        # Generate thumbnail URL from YouTube ID
        if self.youtube_id and not self.thumbnail_url:
            self.thumbnail_url = f'https://img.youtube.com/vi/{self.youtube_id}/maxresdefault.jpg'
        
        # Set default title if empty
        if not self.title:
            self.title = f'Video {self.youtube_id}'
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title or f'Video {self.youtube_id}'
