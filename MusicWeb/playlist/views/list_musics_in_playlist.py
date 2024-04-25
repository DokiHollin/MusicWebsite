from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from playlist.models import Playlist
from music.models import Music
from playlist.serializers import ListAllMusicSerializer
from music.serializers import MusicSerializer

class ListMusicInPlaylist(APIView):
    def get(self, request, playlist_id):
        try:
            # Try to fetch the playlist object using the provided playlist_id
            playlist = Playlist.objects.get(pk=playlist_id)

            # Filter the musics in the playlist that are active
            musics = playlist.musics.filter(is_active=True)

            # Serialize the filtered musics using the MusicSerializer
            serializer = MusicSerializer(musics, many=True)

            # Return a success response with the serialized music data
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Playlist.DoesNotExist:
            # Handle the case where the playlist is not found
            return Response({'error': 'Playlist not found'}, status=status.HTTP_404_NOT_FOUND)
