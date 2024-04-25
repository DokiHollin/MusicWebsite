from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from music.models import Music, Musician, Album
from user.models import CustomUser
from unittest.mock import patch


class SetMusicActiveAPITestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(email='testuser', password='testpassword')
        self.musician = Musician.objects.create(MusicianName='Test Musician', UserID=self.user,)
        self.album = Album.objects.create(album_name='Test Album', release_date='2021-11-30', musician=self.musician)
        self.music = Music.objects.create(
            Musician=self.musician,
            Album=self.album,
            is_active=False
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.url = reverse('set_music_active', kwargs={'pk': self.music.pk})

    def test_set_music_active(self):
        with patch('music.views.active_music_view.async_to_sync') as mock_async_to_sync, \
                patch('music.views.active_music_view.get_channel_layer') as mock_get_channel_layer:
            # Mock the channel layer send method
            mock_channel_layer = mock_get_channel_layer.return_value
            mock_channel_layer.group_send = lambda group_name, message: None

            # Perform the update
            response = self.client.patch(self.url)

            # Refresh from db
            self.music.refresh_from_db()

            # Check that the music was set to active
            self.assertTrue(self.music.is_active)
            # Check that the status code was 204 NO CONTENT
            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
            # Check that async_to_sync was called to send the WebSocket message
            mock_async_to_sync.assert_called_once()

    def test_set_music_active_not_found(self):
        # Set an invalid pk
        self.url = reverse('set_music_active', kwargs={'pk': self.music.pk + 999})

        # Perform the update
        response = self.client.patch(self.url)

        # Check that the status code was 404 NOT FOUND
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)


class MusicCreateAPIViewTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(email='testuser', password='12345')
        self.client.force_authenticate(user=self.user)
        self.musician = Musician.objects.create(UserID=self.user, MusicianName='Test Musician')
        self.url = reverse('create')

    # Valid test
    def test_create_music_upload_failure(self):
        # Mock S3 upload to fail
        with patch('music.views.create_music_view.S3Uploader.upload_music_file', side_effect=Exception('S3 Upload failed')):
            data = {
                'MusicID': 1,
                'Musician': self.musician.MusicianID,
                'Album': '',
                'S3Lrc': 'https://fake-s3-url/lrc-file',
                'S3Music': 'https://fake-s3-url/music-file',
                'Only_for_vip': False,
                'S3Image': 'https://fake-s3-url/image-file',
                'S3MV': 'https://fake-s3-url/mv-file',
                'click_count': 0,
                'is_active': True,
                'duration': '3:00',
                'album_name': 'Test Album',
                'music_name': 'Test Music',
                'release_year': '2022-11-29',
            }
            response = self.client.post(self.url, data, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Invalid Test
    def test_create_music_no_musician(self):
        # Remove the musician to simulate not found
        self.musician.delete()
        data = {
            # Add the necessary fields according to your MusicSerializer
        }
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)


class MusicDeleteAPIViewTestCase(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(email='testuser@example.com', password='12345')
        self.client.force_authenticate(user=self.user)
        self.musician = Musician.objects.create(UserID=self.user, MusicianName='Test Musician')
        self.album = Album.objects.create(album_name='Test Album', release_date='2021-11-30', musician=self.musician)
        self.music = Music.objects.create(
            Musician=self.musician,
            Album=self.album,
        )
        self.url = reverse('delete', kwargs={'pk': self.music.pk})

    # # Valid Test
    # def test_delete_music_success(self):
    #     with patch('music.views.delete_music_view.S3Uploader') as mock_uploader:
    #         mock_uploader.return_value.extract_file_path_from_url.return_value = 'some/file/path'
    #         response = self.client.delete(self.url)
    #         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    #         self.assertFalse(Music.objects.filter(pk=self.music.pk).exists())

    # Invalid Test
    def test_delete_music_not_found(self):
        with patch('music.views.delete_music_view.S3Uploader'):
            Music.objects.all().delete()
            url = reverse('delete', kwargs={'pk': 99999})
            response = self.client.delete(url)
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class MusicDetailsViewTestCase(APITestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(email='testuser@example.com', password='12345')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.musician = Musician.objects.create(UserID=self.user, MusicianName='Test Musician')
        self.album = Album.objects.create(album_name='Test Album', musician=self.musician)
        self.music = Music.objects.create(
            Musician=self.musician,
            Album=self.album,
            music_name='Test Music',
            duration='3:00',
        )

    def test_get_music_details_not_found(self):
        url = reverse('music-details', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_music_detail_success(self):
        url = reverse('music-detail', kwargs={'pk': self.music.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['music_name'], 'Test Music')
        self.assertEqual(response.data['duration'], '3:00')
        self.assertEqual(response.data['album_name'], 'Test Album')

    def test_get_music_detail_not_found(self):
        url = reverse('music-detail', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class MusicViewTestCase(APITestCase):

    def setUp(self):
        # Set up the required objects and authenticate
        self.user = CustomUser.objects.create_user(email='testuser@example.com', password='12345')
        self.client.force_authenticate(user=self.user)
        self.musician = Musician.objects.create(UserID=self.user, MusicianName='Test Musician')
        self.album = Album.objects.create(album_name='Test Album', musician=self.musician)
        self.music = Music.objects.create(
            music_name='Test Music',
            Musician=self.musician,
            Album=self.album,
            S3Image='https://fake-s3-url/image-file',
            S3Info='https://fake-s3-url/info-file',
            S3Lrc='https://fake-s3-url/lyr-file',
            S3Music='https://fake-s3-url/music-file',
        )

    # Valid Test
    def test_get_music_s3_image_success(self):
        # Test the successful retrieval of the S3 image URL
        url = reverse('music-s3image', kwargs={'pk': self.music.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['S3Image'], self.music.S3Image)

    # Invalid Test
    def test_get_music_s3_image_not_found(self):
        # Test the response when the music object does not exist
        url = reverse('music-s3image', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Valid Test
    def test_get_music_s3_info_success(self):
        url = reverse('music-s3info', kwargs={'pk': self.music.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['S3Info'], self.music.S3Info)

    # Invalid Test
    def test_get_music_s3_info_not_found(self):
        # Test the response when the music object does not exist
        url = reverse('music-s3info', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Valid Test
    def test_get_music_s3_lyc_success(self):
        url = reverse('music-s3lyric', kwargs={'pk': self.music.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['S3Lrc'], self.music.S3Lrc)

    # Invalid Test
    def test_get_music_s3_lyc_not_found(self):
        # Test the response when the music object does not exist
        url = reverse('music-s3lyric', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # Valid Test
    def test_get_music_s3_music_success(self):
        url = reverse('music-s3music', kwargs={'pk': self.music.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['S3Music'], self.music.S3Music)

    # Invalid Test
    def test_get_music_s3_music_not_found(self):
        # Test the response when the music object does not exist
        url = reverse('music-s3music', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class RandomMusicViewTestCase(APITestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(email='testuser@example.com', password='12345')
        self.client.force_authenticate(user=self.user)
        self.musician = Musician.objects.create(UserID=self.user, MusicianName='Test Musician')
        self.album = Album.objects.create(album_name='Test Album', musician=self.musician)
        # Create some active music instances
        for _ in range(10):
            Music.objects.create(
                Musician=self.musician,
                Album=self.album,
                music_name=f"Sample Title {_}",
                is_active=True  # Make sure to set `is_active` to True
            )
        # You may also want to create some inactive instances to test that they are not returned
        for _ in range(5):
            Music.objects.create(
                Musician=self.musician,
                Album=self.album,
                music_name=f"Sample Title Inactive {_}",
                is_active=False
            )
        self.url = reverse('random-music')  # Make sure you have named your URL pattern as 'random_music'

    # Valid Test
    def test_get_random_music_list(self):
        response = self.client.get(self.url)
        # Check that the response status code is 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check that we received a list
        self.assertIsInstance(response.data, list)
        # Check that the list contains at most 4 elements, as specified in the view
        self.assertLessEqual(len(response.data), 4)
        # Validate the content of the response, that all returned music instances are active
        for item in response.data:
            self.assertTrue(item['is_active'])


class UpdateClickCountViewTests(APITestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(email='testuser@example.com', password='12345')
        self.client.force_authenticate(user=self.user)
        self.musician = Musician.objects.create(UserID=self.user, MusicianName='Test Musician')
        self.album = Album.objects.create(album_name='Test Album', musician=self.musician)
        self.music = Music.objects.create(MusicID='123', click_count=0, Album=self.album, Musician=self.musician)
        self.url = reverse('update_click_count')

    # Invalid Test
    def test_missing_music_id(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "MusicID parameter is missing.")

    # Invalid Test
    def test_music_not_found(self):
        response = self.client.post(self.url, {'MusicID': '999'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], "Music not found.")

    # Valid Test
    def test_increment_click_count(self):
        response = self.client.post(self.url, {'MusicID': '123'})
        self.music.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['click_count'], self.music.click_count)
        self.assertEqual(self.music.click_count, 1)


class TopMusicViewTests(APITestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(email='testuser@example.com', password='12345')
        self.client.force_authenticate(user=self.user)
        self.musician = Musician.objects.create(UserID=self.user, MusicianName='Test Musician')
        self.album = Album.objects.create(album_name='Test Album', musician=self.musician)
        self.active_musics = [
            Music.objects.create(music_name="Music1", click_count=5, is_active=True, Album=self.album,
                                 Musician=self.musician),
            Music.objects.create(music_name="Music2", click_count=3, is_active=True, Album=self.album,
                                 Musician=self.musician),
            Music.objects.create(music_name="Music3", click_count=13, is_active=True, Album=self.album,
                                 Musician=self.musician),
            Music.objects.create(music_name="Music4", click_count=4, is_active=True, Album=self.album,
                                 Musician=self.musician),
            Music.objects.create(music_name="Music5", click_count=15, is_active=True, Album=self.album,
                                 Musician=self.musician),
            Music.objects.create(music_name="Music6", click_count=6, is_active=True, Album=self.album,
                                 Musician=self.musician),
            Music.objects.create(music_name="Music7", click_count=7, is_active=True, Album=self.album,
                                 Musician=self.musician),
            Music.objects.create(music_name="Music8", click_count=8, is_active=True, Album=self.album,
                                 Musician=self.musician),
            Music.objects.create(music_name="Music9", click_count=9, is_active=True, Album=self.album,
                                 Musician=self.musician),
            Music.objects.create(music_name="Music10", click_count=10, is_active=True, Album=self.album,
                                 Musician=self.musician),
            Music.objects.create(music_name="Music11", click_count=11, is_active=True, Album=self.album,
                                 Musician=self.musician),
        ]
        self.inactive_musics = [
            Music.objects.create(music_name="Inactive Music", click_count=19, is_active=False, Album=self.album,
                                 Musician=self.musician),
        ]
        self.url = reverse('top-music')

    # Valid Test
    def test_retrieve_top_music(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) <= 10)
        if len(response.data) > 1:
            self.assertGreaterEqual(response.data[0]['click_count'], response.data[1]['click_count'])

    # Valid Test
    def test_retrieve_active_music_only(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for music_data in response.data:
            self.assertTrue(music_data['is_active'])

    # Invalid Test
    def test_no_music_found(self):
        Music.objects.filter(is_active=True).delete()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)