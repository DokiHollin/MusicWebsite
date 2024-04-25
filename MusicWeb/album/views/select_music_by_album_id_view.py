from rest_framework import generics
from music.models import Music  
from music.serializers import MusicSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class MusicListByAlbumAPIView(generics.ListAPIView):
    """
    API endpoint to list all the active music tracks for a specific album.
    This endpoint expects the album's ID in the URL.
    """
    permission_classes = [AllowAny]

    serializer_class = MusicSerializer

    def get_queryset(self):
        try:
            # Extract the album ID from the URL and filter active music tracks by it.
            album_id = self.kwargs['album_id']
            return Music.objects.filter(Album_id=album_id, is_active=True)
        except Exception as e:
            # Handle any exception that might occur.
            return Response({"error": f"An error occurred: {str(e)}."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)