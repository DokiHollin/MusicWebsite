
from django.urls import path
from music.views.top_musics_view import TopMusicView
from music.views.update_click_count_view import UpdateClickCountView
from music.views.find_detail_by_id import MusicDetailsView
from music.views.find_image_by_id import MusicS3imageView
from music.views.find_info_by_id import MusicS3InfoView
from music.views.find_lyric_by_id import MusicS3LyricView
from music.views.find_mp3_by_id import MusicS3MusicView
from music.views.find_music_by_id_view import MusicDetailView
from music.views.random_music_view import RandomMusicView
from music.views.select_all_music_view import ActiveMusicListAPIView, InactiveMusicListAPIView

from music.views.active_music_view import SetMusicActiveAPIView
from music.views.create_music_view import MusicCreateAPIView
from music.views.delete_music_view import MusicDeleteAPIView



urlpatterns = [
    # set music to active, arguments : MusicID , this is an url argument
    path('set-music-active/<int:pk>/', SetMusicActiveAPIView.as_view(), name='set_music_active'),

    # api for music create, arguments: 'MusicID', 'S3Info', 'Musician', 'Album', 'S3Lrc', 'S3Music', 'S3Image','S3MV'
    path('create/', MusicCreateAPIView.as_view(), name= 'create'),
    # api for music delete, arguments : MusicID , this is an url argument
    path('delete/<int:pk>/', MusicDeleteAPIView.as_view(), name= 'delete'),

    # api for list all active music, 
    path('list-active-music/', ActiveMusicListAPIView.as_view(), name='active_music_list'),

    # api for list all nonactive music, 
    path('inactive-music/', InactiveMusicListAPIView.as_view(), name='inactive_music_list'),
    
    # api for get random 10 music, return ('MusicID', 'S3Info', 'Musician', 'Album', 'S3Lrc', 'S3Music', 'Only_for_vip', 'S3Image', 'S3MV', 'click_count', 'is_active', 'music_name', 'artist_name', 'duration',"album_name")
    path('random-music/', RandomMusicView.as_view(), name='random-music'),

    #api for get music by id, return ('MusicID', 'S3Info', 'Musician', 'Album', 'S3Lrc', 'S3Music', 'Only_for_vip', 'S3Image', 'S3MV', 'click_count', 'is_active', 'music_name', 'artist_name', 'duration',"album_name")
     path('<int:pk>/', MusicDetailView.as_view(), name='music-detail'),
    
    #api for get music txt file
    path('<int:pk>/s3info/', MusicS3InfoView.as_view(), name='music-s3info'),
    # api for get music mp3
    path('<int:pk>/s3music/', MusicS3MusicView.as_view(), name='music-s3music'),
    # api for get music lyric file
    path('<int:pk>/s3lyric/', MusicS3LyricView.as_view(), name='music-s3lyric'),
    # api for get music image
    path('<int:pk>/s3image/', MusicS3imageView.as_view(), name='music-s3image'),
    # api for get music details, like name, musician, album
    path('<int:pk>/details/', MusicDetailsView.as_view(), name='music-details'),
    # api for update music click count
    path('update_click_count/', UpdateClickCountView.as_view(), name='update_click_count'),

    # Mapping the TopMusicView to the 'top-music/' URL path
    path('top-music/', TopMusicView.as_view(), name='top-music'),
 
]

    




