from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from Musician.models import Musician, CustomUser
from unittest.mock import patch


class ListNonMusicianUsersTestCase(APITestCase):
    def setUp(self):
        user_non_musician = CustomUser.objects.create(username='nonmusician', is_musician=False, email="abc@gmail.com")
        Musician.objects.create(UserID=user_non_musician, MusicianName='NonMusicianUser')

        user_musician = CustomUser.objects.create(username='musician', is_musician=True, email="def@gmail.com")
        Musician.objects.create(UserID=user_musician, MusicianName='MusicianUser')
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    # Valid Test
    def test_list_valid_non_musicians(self):
        url = reverse('list-non-musician-users')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['MusicianName'], 'NonMusicianUser')

    # Invalid Test
    def test_list_invalid_no_non_musicians(self):
        CustomUser.objects.filter(is_musician=False).delete()
        url = reverse('list-non-musician-users')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    # Edge Test
    def test_edge_case_deleted_non_musicians(self):
        CustomUser.objects.filter(is_musician=False).delete()
        Musician.objects.filter(UserID__is_musician=False).delete()
        url = reverse('list-non-musician-users')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)


class MusicianCreateAPIViewTestCase(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(password='12345', email='testuser@example.com')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.create_url = reverse('create_musician')

    # Valid Test
    def test_create_musician_valid(self):
        data = {
            'UserID': self.user.id,
            'MusicianName': 'Test Musician',
            'Genre': 'Rock',
            'Bio': 'Some bio',
            'Region': 'Some region',
            'RealName': 'Real Name',
            'PhoneNumber': '1234567890',
            'Nationality': 'Some nationality',
            'ProfilePictureURL': 'http://example.com/profile.jpg'
        }

        with patch('Musician.views.musician_create_view.S3Uploader') as mock_uploader:
            mock_uploader.return_value.upload_musician_profile.return_value = 'http://example.com/profile.jpg'

            response = self.client.post(self.create_url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['MusicianName'], data['MusicianName'])

    # Invalid Test
    def test_create_musician_invalid(self):
        data = {
            'MusicianName': 'Test Musician',
        }

        response = self.client.post(self.create_url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Edge Test
    def test_create_musician_edge_case_s3_error(self):
        data = {
            'UserID': 'some_user_id',
            'MusicianName': 'Test Musician',
            'ProfilePictureURL': 'fake_picture_file'
        }

        with patch('Musician.views.musician_create_view.S3Uploader') as mock_uploader:
            mock_uploader.return_value.upload_musician_profile.side_effect = Exception('S3 Service Unavailable')

            response = self.client.post(self.create_url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class MusicianDeleteTestCase(APITestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(email='abc@gamil.com', password='testpassword')
        self.musician = Musician.objects.create(
            UserID=self.user,
            MusicianName='Test Musician',
            Genre='Rock',
            Bio='Test bio',
            ProfilePictureURL='http://example.com/profile.jpg'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.delete_url = reverse('delete-musician', kwargs={'musician_id': self.musician.MusicianID})

    # Valid Test
    def test_delete_musician_valid(self):
        with patch('Musician.views.musician_delete_view.S3Uploader') as mock_s3_uploader:
            mock_s3_uploader.return_value.extract_file_path_from_url.return_value = 'profile.jpg'
            mock_s3_uploader.return_value.delete_file.return_value = True

            response = self.client.delete(self.delete_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Invalid Test
    def test_delete_musician_not_found(self):
        invalid_delete_url = reverse('delete-musician', kwargs={'musician_id': 100})
        response = self.client.delete(invalid_delete_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class MusicianUpdateStatusTestCase(APITestCase):

    def setUp(self):
        # 创建用户和音乐家实例
        self.user = CustomUser.objects.create_user(email="abc@gmail.com", password='testpassword', is_musician=False)
        self.musician = Musician.objects.create(
            UserID=self.user,
            MusicianName='Test Musician',
            is_valid=False
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.update_status_url = reverse('update-musician-status', kwargs={'musician_id': self.musician.MusicianID})

    # Valid Test
    def test_update_musician_status_valid(self):
        response = self.client.patch(self.update_status_url, data={}, content_type='application/json')

        self.musician.refresh_from_db()
        self.user.refresh_from_db()

        self.assertTrue(self.musician.is_valid)
        self.assertTrue(self.user.is_musician)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # Invalid Test
    def test_update_musician_status_not_found(self):
        invalid_musician_id = self.musician.MusicianID + 1
        response = self.client.patch(reverse('update-musician-status', kwargs={'musician_id': invalid_musician_id}), data={}, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)