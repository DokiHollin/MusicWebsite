from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from music.models import Music



class MusicS3MusicView(APIView):
    """
    API endpoint to retrieve the S3 music file of a specific music instance.
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
        Handle GET request to return the S3 music file of a music instance.
        """
        music = self.get_object(pk)
        if music:
            return Response({"S3Music": music.S3Music})
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)