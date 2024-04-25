from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from music.models import Music

class MusicS3imageView(APIView):
    """
    API endpoint to retrieve the S3 image URL of a music instance.
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
        Handle GET request to provide the S3 image URL of a music instance.
        """
        music = self.get_object(pk)
        if music:
            return Response({"S3Image": music.S3Image})
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)






