from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from album.models import Album
from rest_framework import status
class AddFavoriteAlbum(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        album_id = request.data.get('album_id')
        
        # Check if album exists
        try:
            album = Album.objects.get(album_id=album_id)
        except Album.DoesNotExist:
            return Response({"error": "Album not found"}, status=status.HTTP_404_NOT_FOUND)

        # Add the album to the user's favorites
        request.user.favorite_albums.add(album)
        return Response({"message": "Album added to favorites"}, status=status.HTTP_200_OK)