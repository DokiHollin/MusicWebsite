from django.urls import path
from Musician.views.musician_delete_view import DeleteMusician
from Musician.views.update_musician_status import UpdateMusicianStatus
from Musician.views.list_invalid_musician_view import ListNonMusicianUsers

from Musician.views.musician_create_view import MusicianCreateAPIView
from . import views

urlpatterns = [
    # create musician
    path('create/', MusicianCreateAPIView.as_view(), name='create_musician'),
    # api for admin to change musician status, argument , musician_id， request header type is patch
    path('update-status/<int:musician_id>/', UpdateMusicianStatus.as_view(), name='update-musician-status'),
    # api for delete musician
    path('delete/<int:musician_id>/', DeleteMusician.as_view(), name='delete-musician'),
    # api for admin to select all muscian that is valid = false.
    path('non-musician-users/', ListNonMusicianUsers.as_view(), name='list-non-musician-users'),

]
