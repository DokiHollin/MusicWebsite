from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from playlist.models import Playlist
from album.models import Album
from music.models import Music
from user.models import CustomUser
from Musician.models import Musician


class AddMusicToPlaylistTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username='testuser', password='12345', email='testuser@example.com')
        self.client.force_authenticate(user=self.user)

        self.musician = Musician.objects.create(UserID=self.user, MusicianName='Test Musician')

        self.album = Album.objects.create(
            musician=self.musician,
            album_name='Test Album',
            genre='Rock'
        )
        self.music = Music.objects.create(
            music_name='Test Song',
            Album=self.album,
            Musician=self.musician)
        self.playlist = Playlist.objects.create(User_ID=self.user, Playlist_Name="My Playlist")
        self.add_music_url = reverse('add_music_to_playlist')

    def test_add_music_to_playlist_valid(self):
        # Valid Test: Add music to a playlist successfully
        payload = {'music_id': self.music.pk, 'playlist_id': self.playlist.Playlist_ID}
        response = self.client.post(self.add_music_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)

    def test_add_music_to_playlist_invalid_music(self):
        # Invalid Test: Music does not exist
        payload = {'music_id': 999, 'playlist_id': self.playlist.Playlist_ID}  # Assuming 999 does not exist
        response = self.client.post(self.add_music_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)

    def test_add_music_to_playlist_invalid_playlist(self):
        # Invalid Test: Playlist does not exist
        payload = {'music_id': self.music.pk, 'playlist_id': 999}  # Assuming 999 does not exist
        response = self.client.post(self.add_music_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)

    def test_add_music_to_playlist_invalid_data(self):
        # Invalid Test: Payload data is incomplete or incorrect
        payload = {'music_id': self.music.pk}  # 'playlist_id' is missing
        response = self.client.post(self.add_music_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('playlist_id' in response.data)

    def test_add_music_to_playlist_duplicate_entry(self):
        # Edge Test: Adding the same music to the same playlist again (duplicate entry)
        self.playlist.musics.add(self.music)
        payload = {'music_id': self.music.pk, 'playlist_id': self.playlist.Playlist_ID}
        response = self.client.post(self.add_music_url, payload, format='json')
        # Assuming that the API has been designed to handle duplicates gracefully
        # If not, this should be a 400 error as your system might not allow duplicates
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)


############################################

class CreatePlaylistTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username='testuser', password='12345', email='testuser@example.com')
        self.client.force_authenticate(user=self.user)
        self.create_playlist_url = reverse('create_playlist')

    def test_create_playlist_valid(self):
        # Valid Test
        payload = {
            'User_ID': self.user.id,
            'Playlist_Name': 'My New Playlist',
            'Description': 'A description for my playlist',
        }
        response = self.client.post(self.create_playlist_url, payload, format='json')
        self.assertIn('Playlist_Name', response.data)

    def test_create_playlist_invalid_no_name(self):
        # Invalid Test: No Playlist_Name provided
        payload = {
            'User_ID': self.user.id,
            # 'Playlist_Name' is omitted on purpose for this test
            'Description': 'A description for my playlist without a name',
        }
        response = self.client.post(self.create_playlist_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Playlist_Name', response.data)

    def test_create_playlist_invalid_unauthenticated(self):
        # Edge Test: Unauthenticated user
        self.client.logout()
        payload = {
            'Playlist_Name': 'My New Playlist',
        }
        response = self.client.post(self.create_playlist_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


####################################################

class DeletePlaylistTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        self.user2 = CustomUser.objects.create_user(password='12345', email='user2@example.com')
        self.client.force_authenticate(user=self.user)
        self.playlist = Playlist.objects.create(User_ID=self.user, Playlist_Name="Test Playlist")
        self.delete_url = reverse('delete_playlist', args=[self.playlist.pk])

    def test_delete_playlist_valid(self):
        # Valid Test: Delete the playlist successfully
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)

    def test_delete_playlist_invalid(self):
        # Invalid Test: Playlist does not exist
        invalid_url = reverse('delete_playlist', args=[999])  # Assuming 999 is an invalid ID
        response = self.client.delete(invalid_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)

    def test_delete_playlist_unauthenticated(self):
        # Edge Test: Attempting to delete a playlist without authentication
        self.client.logout()
        response = self.client.delete(self.delete_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)


###############################################################
class UserPlaylistsListAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        # Create test users
        self.user1 = CustomUser.objects.create_user(username='user1', email='user1@example.com')
        self.user2 = CustomUser.objects.create_user(username='user2', email='user2@example.com')

        # Create playlists for user1
        Playlist.objects.create(User_ID=self.user1, Playlist_Name="User1 Playlist 1")
        Playlist.objects.create(User_ID=self.user1, Playlist_Name="User1 Playlist 2")
        self.client.force_authenticate(user=self.user1)

    def test_get_user_playlists_valid(self):
        # Valid - Fetch User Playlists
        url = reverse('user-playlists-list', args=[self.user1.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Assuming user1 has 2 playlists

    def test_get_user_playlists_invalid_no_content(self):
        # Invalid - User Has No Playlists
        url = reverse('user-playlists-list', args=[self.user2.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_user_playlists_invalid_user_not_found(self):
        # Invalid - User Not Found
        non_existing_user_id = self.user2.pk + 100  # Assuming this user ID does not exist
        url = reverse('user-playlists-list', args=[non_existing_user_id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


#################################################

class ListMusicInPlaylistAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        self.playlist = Playlist.objects.create(User_ID=self.user, Playlist_Name="Test Playlist")

        self.musician = Musician.objects.create(
            UserID=self.user,
            MusicianName='Test Musician',
        )
        self.album = Album.objects.create(
            musician=self.musician,
            album_name='Test Album',
            genre='Rock',
        )
        self.active_music = Music.objects.create(
            music_name='Test Song',
            Musician=self.musician,
            Album=self.album,
            is_active=True
        )
        self.inactive_music = Music.objects.create(
            music_name='Test Inactive Song',
            Musician=self.musician,
            Album=self.album,
            is_active=False
        )
        self.playlist.musics.add(self.active_music)
        self.playlist.musics.add(self.inactive_music)
        self.client.force_authenticate(user=self.user)

    def test_list_active_music_in_playlist_valid(self):
        # Valid - Active Music in Playlist
        url = reverse('list_music_in_playlist', args=[self.playlist.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Only the active music should be listed
        self.assertEqual(response.data[0]['music_name'], self.active_music.music_name)

    def test_list_music_in_nonexistent_playlist_invalid(self):
        # Invalid - Nonexistent Playlist
        nonexistent_playlist_id = self.playlist.pk + 100
        url = reverse('list_music_in_playlist', args=[nonexistent_playlist_id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_list_music_in_playlist_edge_case_inactive(self):
        #  Edge - Inactive Music in Playlist
        # This is an edge case where we check if inactive musics are filtered out
        url = reverse('list_music_in_playlist', args=[self.playlist.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for music in response.data:
            self.assertTrue(music['is_active'])


#######################################################

class RemoveMusicFromPlaylistAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        self.playlist = Playlist.objects.create(User_ID=self.user, Playlist_Name="Test Playlist")
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

        self.playlist.musics.add(self.music)
        self.client.force_authenticate(user=self.user)

    def test_remove_music_from_playlist_valid(self):
        # Valid - Remove Music from Playlist
        data = {
            'music_id': self.music.MusicID,
            'playlist_id': self.playlist.Playlist_ID
        }
        url = reverse('remove_music_from_playlist')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.playlist.refresh_from_db()
        self.assertFalse(self.music in self.playlist.musics.all())

    def test_remove_music_from_playlist_invalid(self):
        # Invalid - Nonexistent Music or Playlist
        data = {
            'music_id': self.music.MusicID + 100,  # Assuming this ID does not exist
            'playlist_id': self.playlist.Playlist_ID + 100  # Assuming this ID does not exist
        }
        url = reverse('remove_music_from_playlist')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
