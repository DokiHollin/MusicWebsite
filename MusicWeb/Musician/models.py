from django.db import models
from user.models import CustomUser

# Define the Musician model
class Musician(models.Model):
    MusicianID = models.BigAutoField(primary_key=True)  # Unique identifier for the musician
    UserID = models.OneToOneField(CustomUser, on_delete=models.CASCADE, db_column='UserID')  # One-to-one relationship with a custom user
    MusicianName = models.CharField(max_length=50, null=False)  # Name of the musician
    Genre = models.CharField(max_length=20, blank=True, null=True)  # Music genre associated with the musician
    Bio = models.TextField(blank=True, null=True)  # Biography or description of the musician
    ProfilePictureURL = models.CharField(max_length=500, blank=True, null=True)  # URL to the musician's profile picture
    Region = models.CharField(max_length=100, blank=True, null=True)  # Region or location of the musician
    RealName = models.CharField(max_length=50, blank=True, null=True)  # Real name of the musician
    PhoneNumber = models.CharField(max_length=20, blank=True, null=True)  # Phone number of the musician
    Nationality = models.CharField(max_length=50, blank=True, null=True)  # Nationality of the musician
    OutsidePlatform = models.CharField(max_length=100, blank=True, null=True)  # Name of an external platform associated with the musician
    Nickname = models.CharField(max_length=50, blank=True, null=True)  # Nickname or ID on other platforms
    PlatformFollowers = models.PositiveIntegerField(default=0)  # Number of followers on the platform
    is_valid = models.BooleanField(default=False)  # Flag to indicate if the musician is valid or not
    
    class Meta:
        db_table = 'musician'  # Set the database table name for the Musician model