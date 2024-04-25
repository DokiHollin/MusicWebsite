from playlist.views.list_all_playlist_by_userID import UserPlaylistsListAPIView
from playlist.views.create_playlist_view import CreatePlaylist
from playlist.views.delete_playlist_view import DeletePlaylist
from playlist.views.list_musics_in_playlist import ListMusicInPlaylist
from playlist.views.remove_music_from_playlist_view import RemoveMusicFromPlaylist
from playlist.views.add_music_to_playlist_view import AddMusicToPlaylist
from django.urls import path

urlpatterns = [
    # add music to playlist, argument: music_id, playlist_id
    path('add_music/', AddMusicToPlaylist.as_view(), name='add_music_to_playlist'),

    # remove music from playlist, argument: music_id, playlist_id
    path('remove_music/', RemoveMusicFromPlaylist.as_view(), name='remove_music_from_playlist'),

    #list all music in this playlist, arguments: playlist_id
    path('<int:playlist_id>/musics/', ListMusicInPlaylist.as_view(), name='list_music_in_playlist'),

    # delete this playlist, arguments : playlist id that need to be delete
    path('<int:playlist_id>/delete/', DeletePlaylist.as_view(), name='delete_playlist'),

    # create playlist, arguments:  "UserID", "PlaylistName","Description",
    path('create/', CreatePlaylist.as_view(), name='create_playlist'),
    # api for list user playlists
    path('<int:user_id>/playlists/', UserPlaylistsListAPIView.as_view(), name='user-playlists-list'),

]
