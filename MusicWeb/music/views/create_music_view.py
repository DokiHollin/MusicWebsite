from rest_framework import status, generics
from rest_framework.response import Response
from Musician.models import Musician
from music.models import Music
from music.serializers import MusicSerializer
from S3_uploader import S3Uploader 
import uuid
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser


class MusicCreateAPIView(APIView):
    """
    API endpoint to create a new music instance and upload associated files to S3.
    """
    queryset = Music.objects.all()
    serializer_class = MusicSerializer

    def post(self, request, *args, **kwargs):
        try:
            # Get user_id from the URL
            user_id = request.user.id
            
            # Fetch the musician based on the user_id
            musician = Musician.objects.get(UserID=user_id)
            
            uploader = S3Uploader()
            music_uuid = uuid.uuid4()
            for file_type in ['S3Lrc', 'S3Music', 'S3Image', 'S3MV']:
                file_obj = request.FILES.get(file_type)
                if file_obj:
                    s3_url = uploader.upload_music_file(music_uuid, file_type, file_obj)
                    request.data[file_type] = s3_url

            # Add the musician_id to the data before creating the music
            request.data['Musician'] = musician.MusicianID

            serializer = MusicSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)