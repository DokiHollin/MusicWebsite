from rest_framework import status
from user.models import CustomUser
from Musician.models import Musician
from rest_framework.views import APIView
from rest_framework.response import Response
from S3_uploader import S3Uploader  
class DeleteMusician(APIView):

    def delete(self, request, musician_id):
        """
        Delete a musician by musician_id and also delete its profile picture from S3 if it exists.
        """
        try:
            musician = Musician.objects.get(MusicianID=musician_id)
            profile_picture_url = musician.ProfilePictureURL

            # Delete the profile picture from S3 if it exists
            if profile_picture_url:
                s3_uploader = S3Uploader()
                file_path = s3_uploader.extract_file_path_from_url(profile_picture_url)
                s3_uploader.delete_file(file_path)

            musician.delete()

            return Response({"message": "Musician and associated profile picture successfully deleted!"}, status=status.HTTP_200_OK)
        
        except Musician.DoesNotExist:
            return Response({"error": "Musician not found"}, status=status.HTTP_404_NOT_FOUND)