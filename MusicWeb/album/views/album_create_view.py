from rest_framework import generics, status
from rest_framework.response import Response
from Musician.models import Musician
from S3_uploader import S3Uploader
from ..models import Album
from ..serializers import AlbumSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class AlbumCreateAPIView(APIView):
    """
    API endpoint to create a new album.
    This endpoint expects album details in the request data.
    If an album cover image is provided, it will be uploaded to S3 and its URL will be saved.
    """

    parser_classes = (MultiPartParser, FormParser)
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            uploader = S3Uploader()

            # Check if an album cover image is provided.
            album_picture = request.FILES.get('album_picture_url')
            if album_picture:
                # Upload the album cover to S3 and get the URL.
                picture_url = uploader.upload_album_cover(album_picture)
                request.data['album_picture_url'] = picture_url

            # Get user_id from the token.
            user_id = request.user.id

            # Based on the user_id, fetch the musician_id.
            musician = Musician.objects.get(UserID=user_id)
            musician_id = musician.MusicianID

            # Add the musician_id to the request data.
            request.data['musician'] = musician_id

            serializer = AlbumSerializer(data=request.data)

            # Validate and save the album details.
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Handle any exception that might occur.
            return Response({"error": f"An error occurred: {str(e)}."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
