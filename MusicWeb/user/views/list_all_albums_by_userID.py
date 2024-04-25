from http.client import NOT_FOUND
from rest_framework.generics import ListAPIView
from user.models import CustomUser

from album.serializers import AlbumSerializer

class UserFavoriteAlbumsListAPIView(ListAPIView):
    serializer_class = AlbumSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        
        # Check if the user exists
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            raise NOT_FOUND(detail="User with the given ID does not exist.", code=404)

        # Return the albums that the user has favorited
        return user.favorite_albums.all()