import boto3
from django.conf import settings

class S3Reader:

    def __init__(self):
        # Initialize the S3 client with AWS credentials from settings
        self.client = boto3.client(
            's3', 
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
        self.bucket_name = settings.AWS_STORAGE_BUCKET_NAME

    def get_file_content(self, file_url):
        try:
            # Extract file path from URL
            url_parts = file_url.replace('https://', '').split('/')
            key = '/'.join(url_parts[1:])

            # Get file object from S3
            obj = self.client.get_object(Bucket=self.bucket_name, Key=key)
            return obj['Body'].read().decode('utf-8')
        except Exception as e:
            # Handle exceptions that may occur during file retrieval
            return str(e)

    def parse_s3_file_content(self, content):
        try:
            lines = content.strip().split('\n')
            return {
                'music_name': lines[0],   
                'artist_name': lines[1],  
                'duration': lines[6]      
            }
        except Exception as e:
            # Handle exceptions that may occur during content parsing
            return str(e)
