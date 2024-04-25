from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.models import CustomUser
from music.serializers import MusicSerializer


class UserFavoriteMusicsView(APIView):
    """
    API View to retrieve a user's favorite songs that are marked as active.
    """

    def get(self, request, user_id):
        """
        Lists the active favorite songs of the given user.
        """

        try:
            # Fetch the user instance from the database
            user = CustomUser.objects.get(pk=user_id)
            
            # Filter the favorite musics of the user that are marked as active
            active_musics = user.favorite_musics.filter(is_active=True)
            
            # Serialize the active musics
            serializer = MusicSerializer(active_musics, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
