from django.db import models
from Musician.models import Musician

# Create your models here.

class Album(models.Model):
    """
    Represents an Album with attributes like album name, musician, release date, genre, etc.
    """
    album_id = models.BigAutoField(primary_key=True)
    musician = models.ForeignKey(Musician, on_delete=models.CASCADE, related_name='albums')
    album_name = models.CharField(max_length=50)
    release_date = models.DateField(blank=True, null=True)
    genre = models.CharField(max_length=20, blank=True, null=True)
    album_picture_url = models.CharField(max_length=500, blank=True, null=True)
    bio = models.CharField(max_length=500, blank=True, null=True)
