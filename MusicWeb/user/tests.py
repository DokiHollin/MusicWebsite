import tempfile
from datetime import timedelta

from django.test import TestCase, RequestFactory

from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone

from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from unittest.mock import patch

from user.models import CustomUser
from Musician.models import Musician
from music.models import Music
from album.models import Album
from user.serializers import IsMusicianSerializer

from django.urls import reverse, NoReverseMatch
from django.core.exceptions import ValidationError

from user.views.update_user_ip_and_location import UpdateUserIPandLocation


class AddFavoriteMusicTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        self.musician = Musician.objects.create(
            UserID=self.user,
            MusicianName='Test Musician',
        )
        self.album = Album.objects.create(
            musician=self.musician,
            album_name='Test Album',
            genre='Rock',
        )
        self.music = Music.objects.create(
            music_name='Test Song',
            Musician=self.musician,
            Album=self.album,
        )

        self.valid_payload = {
            'user_id': self.user.id,
            'music_id': self.music.MusicID,
        }
        self.invalid_payload_user = {
            'user_id': 999,  # assuming this user ID does not exist
            'music_id': self.music.MusicID,
        }
        self.invalid_payload_music = {
            'user_id': self.user.id,
            'music_id': 999,  # assuming this music ID does not exist
        }
        self.add_favorite_url = reverse('add-favorite-music')  # Ensure this is the correct URL name for the view
        self.client.force_authenticate(user=self.user)

    # Valid Test
    def test_add_to_favorites(self):
        response = self.client.post(self.add_favorite_url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Music added to favorites successfully!', response.data['message'])

    # Invalid Test
    def test_add_to_favorites_with_invalid_user(self):
        response = self.client.post(self.add_favorite_url, self.invalid_payload_user, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('User not found.', response.data['error'])

    def test_add_to_favorites_with_invalid_music(self):
        response = self.client.post(self.add_favorite_url, self.invalid_payload_music, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('Music not found.', response.data['error'])

    # Edge Test
    def test_add_to_favorites_when_already_favorited(self):
        self.user.favorite_musics.add(self.music)
        # This payload should be valid, but the music is already in the user's favorites
        response = self.client.post(self.add_favorite_url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Music is already in favorites!', response.data['message'])

    @patch('music.models.Music.objects.get')
    def test_add_to_favorites_internal_server_error(self, mock_get):
        # Configure the mock to raise an exception when called
        mock_get.side_effect = ValidationError("An unexpected error occurred")

        response = self.client.post(self.add_favorite_url, self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('error', response.data)


####################################################

class IsMusicianViewTestCase(APITestCase):
    def setUp(self):
        # Create a user and set up the client to use the authentication
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    # Valid Test
    def test_is_musician_retrieve_valid(self):
        is_musician_url = reverse('is-musician', kwargs={'pk': self.user.pk})
        response = self.client.get(is_musician_url)
        user_data = IsMusicianSerializer(self.user).data

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, user_data)

    # Invalid Test
    def test_is_musician_user_false_valid(self):
        is_musician_url = reverse('is-musician', kwargs={'pk': 9999})
        response = self.client.get(is_musician_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'is_musician': False})

    # Edge Test
    def test_is_musician_no_user_pk_edge(self):
        # Attempt to access the URL without providing a primary key
        try:
            is_musician_url = reverse('is-musician')
            self.fail("Should have thrown a NoReverseMatch exception")
        except NoReverseMatch as e:
            self.assertIn("Reverse for 'is-musician' with no arguments not found.", str(e))


####################################################

class EditUserProfileViewTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        self.client.force_authenticate(user=self.user)
        self.edit_profile_url = reverse('edit_user_profile')

    # Invalid Test
    def test_edit_user_profile_without_profile_picture(self):
        response = self.client.post(self.edit_profile_url, {}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


####################################################

class EditUserDetailsAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        self.client.force_authenticate(user=self.user)
        self.edit_details_url = reverse('edit_user_profile_detail')

    # Valid Test
    def test_edit_user_details_with_valid_data(self):
        data = {'bio': 'New bio', 'username': 'newusername'}
        response = self.client.post(self.edit_details_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.bio, 'New bio')
        self.assertEqual(self.user.username, 'newusername')

    def test_edit_user_details_with_no_data(self):
        data = {}
        response = self.client.post(self.edit_details_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


####################################################

class AddFavoriteAlbumTestCase(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testuser', email='test@example.com',
                                                   password='testpassword')
        self.client.force_authenticate(user=self.user)

        self.musician = Musician.objects.create(
            UserID=self.user,
            MusicianName='Test Musician',
        )
        self.album = Album.objects.create(
            musician=self.musician,
            album_name='Test Album',
            genre='Rock',
        )
        self.url = reverse('favorite_album')

    # Valid Test: Adding an existing album to favorites
    def test_add_album_to_favorites_success(self):
        data = {'album_id': self.album.album_id}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "Album added to favorites"})

    # Invalid Test: Trying to add a non-existent album to favorites
    def test_add_nonexistent_album_to_favorites(self):
        data = {'album_id': 99999}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"error": "Album not found"})


####################################################

class FollowUserTests(APITestCase):

    def setUp(self):
        # Create two users, one to follow and one that performs the following action
        self.user_to_follow = CustomUser.objects.create_user(
            email='followme@example.com',
            username='followme',
            password='testpassword123'
        )
        self.user_follower = CustomUser.objects.create_user(
            email='follower@example.com',
            username='follower',
            password='testpassword456'
        )
        self.client.login(username='follower@example.com', password='testpassword456')
        self.follow_url = reverse('follow-view', kwargs={'user_id': self.user_to_follow.pk})
        self.client.force_authenticate(user=self.user_follower)

    def test_follow_user_success(self):
        """Valid Test: Test successful following of another user."""
        response = self.client.post(self.follow_url)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.json())

    def test_follow_user_self(self):
        """Invalid Test: Test that a user cannot follow themselves."""
        self_follow_url = reverse('follow-view', kwargs={'user_id': self.user_follower.pk})
        response = self.client.post(self_follow_url)
        # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.json())

    def test_follow_user_not_found(self):
        """Edge Test: Test an unexpected error during the follow process."""
        non_existent_user_url = reverse('follow-view', kwargs={'user_id': 9999})
        response = self.client.post(non_existent_user_url)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn('error', response.json())