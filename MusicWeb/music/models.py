from django.db import models
from Musician.models import Musician  
from album.models import Album  

# Define the Music model with various fields
class Music(models.Model):
    MusicID = models.BigAutoField(primary_key=True)
    music_name = models.CharField(max_length=255, blank=True, null=True)
    S3Info = models.CharField(max_length=255, blank=True, null=True)
    Musician = models.ForeignKey(Musician, on_delete=models.CASCADE)
    Album = models.ForeignKey(Album, on_delete=models.CASCADE)
    S3Lrc = models.CharField(max_length=255, blank=True, null=True)
    S3Music = models.CharField(max_length=255, blank=True, null=True)
    Only_for_vip = models.BooleanField(default=False)
    S3Image = models.CharField(max_length=255, blank=True, null=True)
    S3MV = models.CharField(max_length=255, blank=True, null=True)
    click_count = models.PositiveIntegerField(default=0, help_text="Number of times the music has been played or accessed.")
    is_active = models.BooleanField(default = False, help_text="Whether the song is active or not.")
    duration = models.CharField(max_length=10, blank=True, null=True, help_text="Duration of the music in MM:SS format.")