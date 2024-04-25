from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.models import CustomUser
from music.models import Music

class RemoveFavoriteMusicView(APIView):
    """
    API View to allow a user to remove a song from favorites.
    """

    def delete(self, request):
        """
        Removes the given music from the user's list of favorite musics.
        """

        # Extract user_id and music_id from the request data
        user_id = request.data.get('user_id')
        music_id = request.data.get('music_id')

        try:
            # Fetch the user and music instances from the database
            user = CustomUser.objects.get(pk=user_id)
            music = Music.objects.get(pk=music_id)

            # Check if the music is not in user's favorites
            if music not in user.favorite_musics.all():
                return Response({"message": "Music is not in favorites!"}, status=status.HTTP_400_BAD_REQUEST)

            # Remove the music from user's favorites and save
            user.favorite_musics.remove(music)

            return Response({"message": "Music removed from favorites successfully!"}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        except Music.DoesNotExist:
            return Response({"error": "Music not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
