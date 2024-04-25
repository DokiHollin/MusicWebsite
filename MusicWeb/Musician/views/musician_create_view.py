from rest_framework import generics, status
from rest_framework.response import Response
from S3_uploader import S3Uploader
from Musician.models import Musician
from Musician.serializers import MusicianSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView

class MusicianCreateAPIView(APIView):
    # Specify the parser classes to handle multipart and form data
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        try:
            # Initialize the S3Uploader
            uploader = S3Uploader()

            # Get the profile picture from the request's FILES
            profile_picture = request.FILES.get('ProfilePictureURL')
            
            # If a profile picture is provided, upload it to S3 and update the request data
            if profile_picture:
                profile_url = uploader.upload_musician_profile(profile_picture)
                request.data['ProfilePictureURL'] = profile_url

            # Create a MusicianSerializer instance with the request data
            serializer = MusicianSerializer(data=request.data)

            # Check if the serializer is valid
            if serializer.is_valid():
                # Save the musician data to the database
                serializer.save()
                
                # Return a successful response with the serialized data and HTTP status 201 Created
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            # Return an error response with the serializer errors and HTTP status 400 Bad Request
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            # Handle any exceptions that may occur during the process
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
