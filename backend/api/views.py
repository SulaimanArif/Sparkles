from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Playlist, Video
from .serializers import PlaylistSerializer, PlaylistListSerializer, VideoSerializer


class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return PlaylistListSerializer
        return PlaylistSerializer

    @action(detail=True, methods=['get'])
    def videos(self, request, pk=None):
        playlist = self.get_object()
        videos = playlist.videos.all()
        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data)


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Extract YouTube ID before saving
        youtube_url = serializer.validated_data['youtube_url']
        from .models import extract_youtube_id
        youtube_id = extract_youtube_id(youtube_url)
        
        if not youtube_id:
            return Response(
                {'error': 'Invalid YouTube URL'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer.save(youtube_id=youtube_id)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login endpoint that returns a token for authenticated users."""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'is_admin': user.is_staff or user.is_superuser,
        })
    else:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout endpoint that deletes the user's token."""
    try:
        request.user.auth_token.delete()
    except Exception:
        pass
    return Response({'message': 'Successfully logged out'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth_view(request):
    """Check if the user is authenticated."""
    return Response({
        'authenticated': True,
        'user_id': request.user.id,
        'username': request.user.username,
        'is_admin': request.user.is_staff or request.user.is_superuser,
    })
