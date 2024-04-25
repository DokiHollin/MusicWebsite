from django.urls import path
from album.views.Top_albums_by_click import TopAlbumsByClicks

from album.views.get_album_by_id import AlbumDetailAPIView
from album.views.get_albums_by_musicianId import MusicianAlbumsListAPIView, MusicianAlbumsListAPIViewForSearch
from album.views.album_create_view import AlbumCreateAPIView
from album.views.album_delete_view import AlbumDeleteAPIView
from album.views.select_music_by_album_id_view import MusicListByAlbumAPIView
urlpatterns = [
    # create album, arguments : 'album_id', 'musician', 'album_name', 'release_date', 'genre', 'album_picture_url', 'bio'
    path('create/', AlbumCreateAPIView.as_view(), name='create'),
    # delete album, arguments: url parameter, id: long
    path('delete/<int:pk>/', AlbumDeleteAPIView.as_view(), name='delete'),

    # api for select all music by album id, 
    path('list-music-by-album/<int:album_id>/', MusicListByAlbumAPIView.as_view(), name='list-music-by-album'),

     # URL route for AlbumDetailAPIView
    path('<int:pk>/', AlbumDetailAPIView.as_view(), name='album-detail'),
    
    # URL route for MusicianAlbumsListAPIView
    path('musician/<int:user_id>/albums/', MusicianAlbumsListAPIView.as_view(), name='musician-albums-list'),

    path('musician/<int:musician_id>/albums/search', MusicianAlbumsListAPIViewForSearch.as_view(), name='musician-albums-list'),

    # api for rank album
    path('top-albums/', TopAlbumsByClicks.as_view(), name='top-albums'),

]


