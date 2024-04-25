from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from music.models import Music
from user.models import CustomUser
from music.serializers import MusicSerializer
from rest_framework.views import APIView


class AddFavoriteMusicView(APIView):
    """
    API View to allow a user to add a favorite song.
    """

    def post(self, request):
        """
        Adds the given music to the user's list of favorite musics.
        """

        # Extract user_id and music_id from the request data
        user_id = request.data.get('user_id')
        music_id = request.data.get('music_id')

        try:
            # Fetch the user and music instances from the database
            user = CustomUser.objects.get(pk=user_id)
            music = Music.objects.get(pk=music_id)

            # Check if the music is already in user's favorites
            if music in user.favorite_musics.all():
                return Response({"message": "Music is already in favorites!"}, status=status.HTTP_400_BAD_REQUEST)

            # Add the music to user's favorites and save
            user.favorite_musics.add(music)
            user.save()

            return Response({"message": "Music added to favorites successfully!"}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        except Music.DoesNotExist:
            return Response({"error": "Music not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

