from rest_framework import generics
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from album.serializers import AlbumSerializer

from album.models import Album

# API View to get album details by album_id
class AlbumDetailAPIView(generics.RetrieveAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer

    # Override retrieve method to add custom exception handling
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Album.DoesNotExist:
            raise NotFound(detail="Album with the given ID does not exist.", code=404)