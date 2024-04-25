from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from playlist.models import Playlist
from music.models import Music
from playlist.serializers import MusicToPlaylistSerializer

class RemoveMusicFromPlaylist(APIView):
    def post(self, request):
        # Create a serializer instance using the request data
        serializer = MusicToPlaylistSerializer(data=request.data)

        # Check if the serializer is valid
        if serializer.is_valid():
            # Get the music_id and playlist_id from the validated data
            music_id = serializer.validated_data.get('music_id')
            playlist_id = serializer.validated_data.get('playlist_id')

            try:
                # Try to fetch the music and playlist objects using the provided IDs
                music = Music.objects.get(pk=music_id)
                playlist = Playlist.objects.get(pk=playlist_id)

                # Remove the music from the playlist
                playlist.musics.remove(music)

                # Return a success response
                return Response({'message': 'Music removed from playlist successfully'}, status=status.HTTP_200_OK)

            except (Music.DoesNotExist, Playlist.DoesNotExist):
                # Handle the case where either the music or the playlist is not found
                return Response({'error': 'Music or Playlist not found'}, status=status.HTTP_404_NOT_FOUND)

        # Return an error response with serializer errors if the data is not valid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
