from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from playlist.serializers import PlaylistCreateSerializer

class CreatePlaylist(APIView):
    def post(self, request):
        # Create a serializer instance using the request data
        serializer = PlaylistCreateSerializer(data=request.data)

        # Check if the serializer is valid
        if serializer.is_valid():
            # Save the playlist data to the database
            serializer.save()

            # Return a success response with the serialized data
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Return an error response with serializer errors if the data is not valid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)