from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient, APITestCase
from rest_framework.authtoken.models import Token
from django.core.exceptions import ValidationError
from album.models import Album
from music.models import Music
from user.models import CustomUser
from Musician.models import Musician
from django.urls import reverse
from rest_framework import status
from unittest.mock import patch, call


class SearchAPIViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        # Creating test data for artists, songs, albums, and users
        self.musician = Musician.objects.create(UserID=self.user, MusicianName='test Musician')

        self.album = Album.objects.create(
            musician=self.musician,
            album_name='test Album',
            genre='Rock'
        )

        self.music = Music.objects.create(
            Album=self.album,
            Musician=self.musician
        )
        self.url = reverse('search_api')

    # Valid search results
    def test_search_results(self):
        response = self.client.get(self.url, {'q': 'test'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Invalid Test: Search query does not match any records
    def test_search_no_results(self):
        response = self.client.get(self.url, {'q': 'nonexistent'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['artists'], [])
        self.assertEqual(response.data['songs'], [])
        self.assertEqual(response.data['albums'], [])
        self.assertEqual(response.data['users'], [])


    # Edge Test: Search when there is an internal server error, e.g., database is down
    def test_search_internal_server_error(self):
        with patch('Musician.models.Musician.objects.filter') as mock_filter:
            mock_filter.side_effect = Exception("Database error")
            response = self.client.get(self.url, {'q': 'test'})
            self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
            self.assertDictEqual(response.data,{"message": "An error occurred while processing the search request."})