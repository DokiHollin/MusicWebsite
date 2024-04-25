import boto3
from django.conf import settings

class S3Uploader:

    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
        self.bucket_name = settings.AWS_STORAGE_BUCKET_NAME

    def _generate_url(self, file_path):
        region_name = self.s3_client.get_bucket_location(Bucket=self.bucket_name)['LocationConstraint']
        return f"https://{self.bucket_name}.s3.{region_name}.amazonaws.com/{file_path}"

    def upload_file(self, file_obj, upload_path):
        """
        Upload a file to S3 and return the file URL.

        :param file_obj: The file object to be uploaded.
        :param upload_path: The path within the S3 bucket to store the file.
        :return: The file's URL after uploading.
        """
        full_path = f"{upload_path}/{file_obj.name}"
        try:
            self.s3_client.upload_fileobj(file_obj, self.bucket_name, full_path, ExtraArgs={'ACL': 'public-read'})
            return self._generate_url(full_path)
        except Exception as e:
            print(f"Error uploading to S3: {e}")
            return None  # Return None if there's an error

    # upload musician_profile to s3
    def upload_musician_profile(self, file_obj):
        return self.upload_file(file_obj, "MusicianProfile")

    # upload album cover to s3
    def upload_album_cover(self, file_obj):
        return self.upload_file(file_obj, "AlbumCovers")
    
        # upload poster cover to s3
    def upload_poster(self, file_obj):
        return self.upload_file(file_obj, "poster")

    # upload music files to s3
    def upload_music_file(self, music_id, file_type, file_obj):
        """
        Upload a music-related file to S3 and return the file URL.

        :param music_id: The ID of the music.
        :param file_type: The type of the file (e.g., 'info', 'lrc', 'audio', 'image', 'mv').
        :param file_obj: The file object to be uploaded.
        :return: The file's URL after uploading.
        """
        upload_path = f"Music/{music_id}/{file_type}"
        return self.upload_file(file_obj, upload_path)  # Reuse the upload_file method
    

    #extract url from object url
    def extract_file_path_from_url(self, object_url):
        """from object url extract orgin url"""
        base_url = f"https://{self.bucket_name}.s3."
        
        partial_path = object_url.replace(base_url, '')
        
        
        file_path = partial_path.split('.amazonaws.com/', 1)[-1]
    
        return file_path

    # delete file from S3
    def delete_file(self, key):
        """
        Delete a file from S3.

        :param key: The full path (key) of the file within the S3 bucket.
        """
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=key)
            print(f"Successfully deleted {key} from S3.")
        except Exception as e:
            print(f"Error deleting {key} from S3: {e}")

    def upload_user_profile_picture(self, user, file_obj):
        """
        Upload a user's profile picture to S3.

        :param user: The user instance.
        :param file_obj: The file object to be uploaded.
        :return: The file's URL after uploading.
        """
        # Check if the user already has a profile picture
        if user.profile_picture:
            try:
            # Extract the S3 key from the stored URL and delete the file from S3
                s3_key = self.extract_file_path_from_url(user.profile_picture)
                self.delete_file(s3_key)
            except Exception as e:
                print(f"Error deleting the old profile picture: {e}")

        # Upload the new profile picture
        file_url = self.upload_file(file_obj, "UserProfilePictures")
        if file_url:
            user.profile_picture = file_url
            user.save()

        return file_url

