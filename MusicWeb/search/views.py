from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from Musician.models import Musician
from music.models import Music
from album.models import Album
from user.models import CustomUser
from rest_framework.permissions import AllowAny

class SearchAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        try:
            query = request.GET.get('q', '')

            # Search for artists. Filter artists whose 'is_valid' attribute is True.
            artists = Musician.objects.filter(MusicianName__icontains=query, is_valid=True)[:4]
            artists_data = [{'id': artist.MusicianID, 'MusicianName': artist.MusicianName} for artist in artists]

            # Search for songs. Filter songs that are both valid and active.
            songs = Music.objects.filter(music_name__icontains=query,  is_active=True)[:4]
            songs_data = [{'id': song.MusicID, 'name': song.music_name, 'artist': song.Musician.MusicianName} for song in songs]

            # Search for albums.
            albums = Album.objects.filter(album_name__icontains=query)[:4]
            albums_data = [{'id': album.album_id, 'album_name': album.album_name, 'thumbnail': album.album_picture_url} for album in albums]

            # Search for users. Exclude users with 'is_musician' attribute set to True.
            users = CustomUser.objects.filter(username__icontains=query, is_musician=False)[:4]
            users_data = [{'id': user.pk, 'name': user.username} for user in users]

            # Combine all search results into a dictionary.
            data = {
                'artists': artists_data,
                'songs': songs_data,
                'albums': albums_data,
                'users': users_data,
            }

            return Response(data, status=status.HTTP_200_OK)
        
        # Handle potential exceptions and provide a user-friendly error message.
        except Exception as e:
            # Log the exception for debugging purposes.
            print(f"Error in SearchAPIView: {e}")
            return Response({"message": "An error occurred while processing the search request."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
