from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from playlist.models import Playlist

class DeletePlaylist(APIView):
    def delete(self, request, playlist_id):
        try:
            # Try to fetch the playlist object using the provided playlist_id
            playlist = Playlist.objects.get(pk=playlist_id)

            # Delete the playlist from the database
            playlist.delete()

            # Return a success response
            return Response({'message': 'Playlist deleted successfully'}, status=status.HTTP_200_OK)

        except Playlist.DoesNotExist:
            # Handle the case where the playlist is not found
            return Response({'error': 'Playlist not found'}, status=status.HTTP_404_NOT_FOUND)
