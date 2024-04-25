from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from homepage_poster.models import HomePagePoster
from homepage_poster.serializers import HomePagePosterSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from S3_uploader import S3Uploader

class UploadPosterView(APIView):
    """
    API endpoint to upload a poster for the homepage.
    This endpoint expects the poster image in the request data.
    If an image is provided, it will be uploaded to S3 and its URL will be saved.
    """
    
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        try:
            uploader = S3Uploader()
            
            # Check if a poster image is provided in the request.
            poster_image = request.FILES.get('url')
            if poster_image:
                # Upload the poster image to S3 and get the URL.
                url = uploader.upload_poster(poster_image)
                request.data['url'] = url

            # Serialize the request data to validate and save.
            serializer = HomePagePosterSerializer(data=request.data)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            # Handle any exceptions that might arise.
            return Response({"error": f"An error occurred: {str(e)}."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
