from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from music.models import Music
from rest_framework.permissions import AllowAny

class UpdateClickCountView(APIView):
    """
    API endpoint to increment the click count for a specific music ID.
    """
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        
        # Try to get the MusicID from the request data
        music_id = request.data.get('MusicID')  # Using request.data instead of request.POST

        # If MusicID isn't provided, return an error response
        if not music_id:
            return Response({"error": "MusicID parameter is missing."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Attempt to retrieve the music object from the database
            music = Music.objects.get(MusicID=music_id)
            
            # Increment the click_count
            music.click_count += 1
            music.save()

            # Return the updated click_count
            return Response({"MusicID": music.MusicID, "click_count": music.click_count}, status=status.HTTP_200_OK)

        except Music.DoesNotExist:
            # If the provided MusicID is not found in the database, return an error response
            return Response({"error": "Music not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            # Catch all other exceptions and return an error response
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
