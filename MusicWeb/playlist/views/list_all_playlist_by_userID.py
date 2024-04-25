from rest_framework import generics
from rest_framework.exceptions import NotFound
from playlist.models import Playlist
from playlist.serializers import PlaylistSerializerForProfile

class UserPlaylistsListAPIView(generics.ListAPIView):
    # Set the serializer class
    serializer_class = PlaylistSerializerForProfile
    
    def get_queryset(self):
        try:
            # Fetch user_id from the URL kwargs
            user_id = self.kwargs.get('user_id')
            
            # Query playlists based on the user_id
            playlists = Playlist.objects.filter(User_ID=user_id)
            
            # Check if any playlists were found
            if not playlists.exists():
                raise NotFound(detail="No playlists found for the given user ID.")
            
            return playlists

        except Exception as e:
            # Handle any exceptions that may occur during the process
            raise NotFound(detail="An error occurred while fetching user playlists: {}".format(str(e)))
