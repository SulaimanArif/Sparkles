from rest_framework import serializers
from .models import Playlist, Video


class VideoSerializer(serializers.ModelSerializer):
    playlist_name = serializers.CharField(source='playlist.name', read_only=True)

    class Meta:
        model = Video
        fields = ['id', 'title', 'youtube_url', 'youtube_id', 'playlist', 'playlist_name', 
                  'thumbnail_url', 'added_at', 'order']
        read_only_fields = ['youtube_id', 'thumbnail_url', 'added_at']

    def validate_youtube_url(self, value):
        """Validate that the URL is a valid YouTube URL."""
        from .models import extract_youtube_id
        
        youtube_id = extract_youtube_id(value)
        if not youtube_id:
            raise serializers.ValidationError(
                "Invalid YouTube URL. Please provide a valid YouTube video URL."
            )
        return value

    def update(self, instance, validated_data):
        youtube_url = validated_data.get('youtube_url')
        if youtube_url:
            from .models import extract_youtube_id, fetch_youtube_title
            youtube_id = extract_youtube_id(youtube_url)
            if youtube_id:
                validated_data['youtube_id'] = youtube_id
                validated_data['thumbnail_url'] = (
                    f'https://img.youtube.com/vi/{youtube_id}/maxresdefault.jpg'
                )
                if not str(validated_data.get('title', '')).strip():
                    fetched_title = fetch_youtube_title(youtube_url)
                    if fetched_title:
                        validated_data['title'] = fetched_title
        return super().update(instance, validated_data)


class PlaylistSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)
    video_count = serializers.IntegerField(source='videos.count', read_only=True)

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'videos', 'video_count']


class PlaylistListSerializer(serializers.ModelSerializer):
    video_count = serializers.IntegerField(source='videos.count', read_only=True)

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'video_count']
