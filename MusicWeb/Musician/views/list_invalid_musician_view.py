from rest_framework import status
from rest_framework.response import Response
from Musician.models import Musician
from Musician.serializers import MusicianSerializer
from rest_framework.views import APIView
class ListNonMusicianUsers(APIView):

    def get(self, request):
        """
        List all musicians where is_musician field is set to false.
        """
        try:
            # Query the database for Musicians where is_musician is False
            non_musicians = Musician.objects.filter(UserID__is_musician=False)

            # Serialize the queryset
            serializer = MusicianSerializer(non_musicians, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)