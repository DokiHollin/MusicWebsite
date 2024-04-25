from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.models import CustomUser
from Musician.models import Musician

class UpdateMusicianStatus(APIView):

    def patch(self, request, musician_id):
        """
        Update is_valid field of a musician and is_musician field of the associated user.
        """
        try:
            musician = Musician.objects.get(MusicianID=musician_id)
            musician.is_valid = True
            musician.save()

            # Update the associated user's is_musician field
            user = musician.UserID
            user.is_musician = True
            user.save()

            return Response({"message": "Successfully updated!"}, status=status.HTTP_200_OK)
        
        except Musician.DoesNotExist:
            return Response({"error": "Musician not found"}, status=status.HTTP_404_NOT_FOUND)
