from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from homepage_poster.models import HomePagePoster
from django.utils import timezone
from unittest.mock import patch
from django.core.files.uploadedfile import SimpleUploadedFile

from user.models import CustomUser


class ListAllPostersAPITests(APITestCase):

    def setUp(self):
        # This method will run before each test in this class
        # Create sample poster data
        HomePagePoster.objects.create(url="http://example.com/poster1.jpg", uploaded_at=timezone.now())
        HomePagePoster.objects.create(url="http://example.com/poster2.jpg", uploaded_at=timezone.now())

    # Valid Test
    def test_list_all_posters(self):
        """
        Ensure we can retrieve all posters.
        """
        url = reverse('all-posters-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if two posters are returned, as created in setUp
        self.assertEqual(len(response.data), 2)

    # Invalid Test
    def test_no_posters_found(self):
        """
        Ensure the correct response is returned when no posters are available.
        """
        # Delete all posters to simulate no posters available
        HomePagePoster.objects.all().delete()

        url = reverse('all-posters-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail'], "No posters found.")


class UploadPosterViewTestCase(APITestCase):
    def setUp(self):
        self.upload_poster_url = reverse('upload_poster')
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    # Valid Test
    def test_upload_valid_poster(self):
        with patch('S3_uploader.S3Uploader.upload_poster') as mock_upload_poster:
            mock_upload_poster.return_value = 'http://s3.example.com/poster.jpg'
            poster_image = SimpleUploadedFile("poster.jpg", b"poster_image_content", content_type="image/jpeg")
            response = self.client.post(self.upload_poster_url, {'url': poster_image}, format='multipart')

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

            self.assertTrue(HomePagePoster.objects.filter(url='http://s3.example.com/poster.jpg').exists())

    # Invalid Test
    def test_upload_invalid_poster(self):
        with patch('S3_uploader.S3Uploader.upload_poster') as mock_upload_poster:
            mock_upload_poster.side_effect = Exception("Invalid poster format")
            invalid_poster_image = SimpleUploadedFile("poster.txt", b"wrong_content", content_type="text/plain")
            response = self.client.post(self.upload_poster_url, {'url': invalid_poster_image}, format='multipart')

            self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)