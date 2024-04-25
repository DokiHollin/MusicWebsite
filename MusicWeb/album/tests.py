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


class AlbumCreateAPIViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        self.musician = Musician.objects.create(
            UserID=self.user,
            MusicianName='Test Musician',
            # Add other fields if necessary
        )
        self.token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.album_create_url = reverse('create')
        self.album_data_with_image = {
            'album_name': 'Test Album With Image',
            'genre': 'Rock',
            'musician': self.musician.MusicianID,
            'album_picture_url': None,  # Will be replaced in the test
        }
        self.album_data_without_image = {
            'album_name': 'Test Album Without Image',
            'genre': 'Rock',
            'musician': self.musician.MusicianID,
        }

    # Valid Test
    def test_create_album_with_image(self):
        with patch('S3_uploader.S3Uploader.upload_album_cover',
                   return_value='http://example.com/image.jpg') as mock_upload:
            image = SimpleUploadedFile("image.jpg", b"file_content", content_type="image/jpeg")
            data_with_image = self.album_data_with_image.copy()
            data_with_image['album_picture_url'] = image  # Use the SimpleUploadedFile to simulate file upload
            response = self.client.post(self.album_create_url, data_with_image, format='multipart')
            self.assertIn('album_picture_url', response.data)
            self.assertEqual(response.data['album_picture_url'], 'http://example.com/image.jpg')
            mock_upload.assert_called_once()

    # Invalid Test
    def test_create_album_exception(self):
        with patch('Musician.models.Musician.objects.get', side_effect=Exception('Test exception')):
            response = self.client.post(self.album_create_url, self.album_data_without_image, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
            self.assertIn('Test exception', response.data['error'])

    # Invalid Test
    def test_create_album_with_invalid_image_format(self):
        with patch('S3_uploader.S3Uploader.upload_album_cover') as mock_upload:
            invalid_image = SimpleUploadedFile("image.txt", b"not really an image", content_type="text/plain")
            data_with_invalid_image = self.album_data_with_image.copy()
            data_with_invalid_image['album_picture_url'] = invalid_image  # Use the SimpleUploadedFile with wrong format

            response = self.client.post(self.album_create_url, data_with_invalid_image, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn('album_picture_url', response.data)
            # self.assertIn('error message related to invalid format', response.data['album_picture_url'])
            # mock_upload.assert_not_called()

    # Edge Test
    def test_create_album_with_large_image(self):
        with patch('S3_uploader.S3Uploader.upload_album_cover') as mock_upload:
            large_image = SimpleUploadedFile("large_image.jpg", b"file_content" * (1024 * 1024 * 5),
                                             content_type="image/jpeg")  # Adjust size as necessary
            data_with_large_image = self.album_data_with_image.copy()
            data_with_large_image['album_picture_url'] = large_image  # Use the SimpleUploadedFile with large size

            response = self.client.post(self.album_create_url, data_with_large_image, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn('album_picture_url', response.data)
            # self.assertIn('error message related to large file size', response.data['album_picture_url'])
            # mock_upload.assert_not_called()


class AlbumDeleteAPIViewTestCase(APITestCase):
    def setUp(self):
        # First create a CustomUser instance
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        # Then create a Musician instance that is linked to the user
        self.musician = Musician.objects.create(UserID=self.user, MusicianName='Test Musician')
        # Now you can create an Album instance with the Musician
        self.album = Album.objects.create(
            musician=self.musician,
            album_name='Test Album',
            genre='Rock'
            # Add other necessary fields
        )
        # Assuming Music model has a field 'Album' to relate with Album instance
        self.music = Music.objects.create(
            Album=self.album,
            Musician=self.musician
            # Set other necessary fields
        )
        self.delete_url = reverse('delete', kwargs={'pk': self.album.album_id})

    # Valid Test
    def test_delete_album(self):
        with patch('S3_uploader.S3Uploader.delete_file') as mock_delete_file:
            response = self.client.delete(self.delete_url)
            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
            self.assertFalse(Album.objects.filter(pk=self.album.pk).exists())
            self.assertFalse(Music.objects.filter(Album=self.album).exists())
            expected_delete_calls = [
                                        call(music.S3Info) for music in Music.objects.filter(Album=self.album)
                                    ] + [
                                        call(music.S3Lrc) for music in Music.objects.filter(Album=self.album)
                                    ] + [
                                        # Include calls for other file types if necessary
                                    ]
            mock_delete_file.assert_has_calls(expected_delete_calls, any_order=True)

    # Invalid Test
    def test_delete_album_not_found(self):
        url = reverse('delete', kwargs={'pk': 9999})  # Assuming 9999 is a non-existent album
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class AlbumDetailAPIViewTest(APITestCase):

    def setUp(self):
        # Create a test user
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        # Create a test musician linked to the user
        self.musician = Musician.objects.create(UserID=self.user, MusicianName='Test Musician')
        # Create a test album linked to the musician
        self.album = Album.objects.create(
            musician=self.musician,
            album_name='Test Album',
            genre='Rock'
        )
        # Define the URL for the API endpoint
        self.detail_url = reverse('album-detail', kwargs={'pk': self.album.album_id})

    # Valid Test
    def test_get_album_detail_success(self):
        """
        Test case for successfully retrieving album details.
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['album_name'], 'Test Album')
        self.assertEqual(response.data['musician_name'], 'Test Musician')

    # Invalid Test
    def test_get_album_detail_not_found(self):
        """
        Test case for the scenario when the album does not exist.
        """
        self.client.force_authenticate(user=self.user)
        wrong_detail_url = reverse('album-detail', kwargs={'pk': self.album.album_id + 1})
        response = self.client.get(wrong_detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class MusicianAlbumsListAPIViewTest(APITestCase):
    def setUp(self):
        # Create a custom user and a musician linked to the user
        self.user = CustomUser.objects.create_user(username='testuser', email='testuser@example.com',
                                                   password='testpassword')
        self.musician = Musician.objects.create(UserID=self.user, MusicianName='Test Musician')

        # Create albums linked to the musician
        self.album1 = Album.objects.create(musician=self.musician, album_name='Test Album 1', genre='Rock')
        self.album2 = Album.objects.create(musician=self.musician, album_name='Test Album 2', genre='Pop')

        # URL for getting albums by user_id
        self.list_url = reverse('musician-albums-list', kwargs={'user_id': self.user.id})

    # Valid Test
    def test_get_albums_by_user(self):
        # Authenticate the test client
        self.client.force_authenticate(user=self.user)

        # Perform a GET request to the view
        response = self.client.get(self.list_url)

        # Assert that the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Assert that the response contains the correct number of albums
        self.assertEqual(len(response.data), 2)

    # Invalid Test
    def test_get_albums_by_user_not_found(self):
        # Authenticate the test client
        self.client.force_authenticate(user=self.user)

        # Perform a GET request to the view with an invalid user_id
        wrong_list_url = reverse('musician-albums-list', kwargs={'user_id': self.user.id + 1})
        response = self.client.get(wrong_list_url)

        # Assert that the response status code is 404 Not Found
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class MusicListByAlbumAPIViewTestCase(APITestCase):
    def setUp(self):
        # Create an Album instance
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        # Then create a Musician instance that is linked to the user
        self.musician = Musician.objects.create(UserID=self.user, MusicianName='Test Musician')
        # Now you can create an Album instance with the Musician
        self.album = Album.objects.create(
            musician=self.musician,
            album_name='Test Album',
            genre='Rock'
            # Add other necessary fields
        )

        # Create active Music instances related to the album
        self.active_music = Music.objects.create(
            Musician=self.musician,
            Album=self.album,
            music_name='Active Music',
            is_active=True
        )

        # Create inactive Music instances related to the album
        self.inactive_music = Music.objects.create(
            Musician=self.musician,
            Album=self.album,
            music_name='Inactive Music',
            is_active=False
        )

    # Valid Test
    def test_list_active_music_for_album(self):
        # Create the URL for the specific album's music list
        url = reverse('list-music-by-album', kwargs={'album_id': self.album.album_id})
        response = self.client.get(url)

        # Check if the response status code is 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check if the response contains only active music tracks
        for music_data in response.data:
            self.assertTrue(music_data['is_active'])

    # Invalid Test
    def test_list_music_for_nonexistent_album(self):
        # Use an album_id that doesn't exist
        url = reverse('list-music-by-album', kwargs={'album_id': 9999})
        response = self.client.get(url)

        self.assertEqual(len(response.data), 0)

    # Edge Test
    def test_list_music_for_album_without_active_tracks(self):
        # Create an album with no active music tracks
        album_with_no_active_music = Album.objects.create(album_name='No Active Music Album', musician=self.musician)
        url = reverse('list-music-by-album', kwargs={'album_id': album_with_no_active_music.album_id})
        response = self.client.get(url)

        # Check if the response status code is 200 OK but the response data is empty
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)


class TopAlbumsByClicksAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        # Then create a Musician instance that is linked to the user
        self.musician = Musician.objects.create(UserID=self.user, MusicianName='Test Musician')
        self.url = reverse('top-albums')  # Ensure this is the correct URL name
        # Create some album instances with associated music and clicks
        self.album1 = Album.objects.create(album_name='Album 1', musician=self.musician)
        Music.objects.create(Album=self.album1, click_count=100, Musician=self.musician)

        self.album2 = Album.objects.create(album_name='Album 2', musician=self.musician)
        Music.objects.create(Album=self.album2, click_count=150, Musician=self.musician)

    # Valid Test
    def test_get_top_albums_by_clicks(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) <= 8)  # Since we expect no more than 8 albums

    # Invalid Test
    def test_get_top_albums_no_albums(self):
        Album.objects.all().delete()  # Clear all albums
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Expect an empty list

    # Edge Test
    def test_get_top_albums_exception_handling(self):
        with patch('album.models.Album.objects.annotate') as mock_annotate:
            mock_annotate.side_effect = Exception("Unexpected Error")
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
            self.assertEqual(response.data['detail'], "An error occurred. Please try again later.")

    # Edge Test
    def test_get_top_albums_validation_error(self):
        # Patch the Album.objects.annotate() to raise a ValidationError
        with patch('album.models.Album.objects.annotate') as mock_annotate:
            mock_annotate.side_effect = ValidationError("Test Validation Error")
            response = self.client.get(self.url)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertEqual(response.data['detail'], str(["Test Validation Error"]))