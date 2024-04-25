from rest_framework import generics
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from Musician.models import Musician
from album.serializers import AlbumSerializer
from album.models import Album
from user.models import CustomUser  # Import the CustomUser model

# API View to get all albums for a given musician using the user's ID
class MusicianAlbumsListAPIView(generics.ListAPIView):
    serializer_class = AlbumSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']  # Get the user_id from the passed arguments
        try:
            musician = Musician.objects.get(UserID=user_id)  # Retrieve the Musician object using the user_id
            return Album.objects.filter(musician=musician)  # Filter albums using the musician object
        except Musician.DoesNotExist:
            raise NotFound(detail="Musician with the given user ID does not exist.", code=404)
    
    # Override the list method to add custom exception handling
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            if not queryset.exists():
                raise NotFound(detail="No albums found for the given user ID.", code=404)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            raise NotFound(detail="User with the given ID does not exist.", code=404)

    

# API View to retrieve all albums for a given musician using the musician's ID
class MusicianAlbumsListAPIViewForSearch(generics.ListAPIView):
    serializer_class = AlbumSerializer

    def get_queryset(self):
        """
        Retrieve the queryset of albums for a given musician based on the provided musician_id.
        """
        musician_id = self.kwargs['musician_id']  # Get the musician_id from the passed arguments
        
        try:
            musician = Musician.objects.get(MusicianID=musician_id)  # Retrieve the Musician object using the musician_id
            return Album.objects.filter(musician=musician)  # Filter albums using the musician object
        except Musician.DoesNotExist:
            raise NotFound(detail="Musician with the given ID does not exist.", code=404)
    
    def list(self, request, *args, **kwargs):
        """
        Override the list method to handle requests, apply custom exception handling, 
        and respond with the list of albums or appropriate error messages.
        """
        try:
            queryset = self.get_queryset()
            if not queryset.exists():
                raise NotFound(detail="No albums found for the given musician ID.", code=404)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Musician.DoesNotExist:
            raise NotFound(detail="Musician with the given ID does not exist.", code=404)