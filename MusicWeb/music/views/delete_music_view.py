from rest_framework import status, generics
from rest_framework.response import Response
from S3_uploader import S3Uploader
from music.serializers import MusicSerializer
from music.models import Music


class MusicDeleteAPIView(generics.DestroyAPIView):
    """
    API endpoint to delete a music instance and remove associated files from S3.
    """
    queryset = Music.objects.all()
    serializer_class = MusicSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            music = self.get_object()
            uploader = S3Uploader()

            # Delete files from S3
            for file_type in ['S3Info', 'S3Lrc', 'S3Music', 'S3Image', 'S3MV']:
                object_url = getattr(music, file_type, None)
                if object_url:
                    file_path = uploader.extract_file_path_from_url(object_url)
                    if file_path:
                        uploader.delete_file(file_path)

            # Now delete the music record from the database
            music.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)