from music.serializers import MusicSerializerforDetails
from rest_framework.response import Response
from music.models import Music
from rest_framework.views import APIView
from rest_framework import status
class MusicDetailsView(APIView):
    """
    API endpoint to retrieve detailed information about a music instance.
    """

    def get_object(self, pk):
        """
        Retrieve the Music object by primary key. Return None if not found.
        """
        try:
            return Music.objects.get(pk=pk)
        except Music.DoesNotExist:
            return None

    def get(self, request, pk, format=None):
        """
        Handle GET request to provide specific details of a music instance.
        """
        music = self.get_object(pk)
        if music:
            serializer = MusicSerializerforDetails(music)
            data = {
                "music_name": serializer.data["music_name"],
                "artist_name": serializer.data["artist_name"],
                "duration": serializer.data["duration"],
                "album_name": serializer.data["album_name"],
            }
            return Response(data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)