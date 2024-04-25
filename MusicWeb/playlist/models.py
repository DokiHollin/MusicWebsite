
# Create your models here.
from django.db import models
from music.models import Music
from user.models import CustomUser
# entiy for playlist
class Playlist(models.Model):
    Playlist_ID = models.BigAutoField(primary_key=True)
    User_ID = models.ForeignKey(CustomUser, on_delete=models.CASCADE, db_column='UserID')
    Playlist_Name = models.CharField(max_length=255)
    Description = models.CharField(max_length=500, blank=True, null=True)
    Visibility = models.BooleanField(default=True)
    musics = models.ManyToManyField(Music)

    class Meta:
        db_table = 'Playlist'

    def __str__(self):
        return self.Playlist_Name