from http.client import NOT_FOUND
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from music.models import Music
from music.serializers import MusicSerializer

from music.models import Music
from music.serializers import MusicSerializer

class MusicDetailView(APIView):
    """
    API endpoint to retrieve details of a specific music instance based on its primary key.
    """

    def get_object(self, pk):
        """
        Retrieve the Music object using the provided primary key.
        Returns the music instance if found, else None.
        """
        try:
            return Music.objects.get(pk=pk)
        except Music.DoesNotExist:
            return None

    def get(self, request, pk, format=None):
        """
        Handle GET request to return details of the music instance.
        """
        music = self.get_object(pk)
        if music:
            serializer = MusicSerializer(music)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)