from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

# Custom user manager for handling user creation
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        # Create a user with the provided email and password
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        # Create a superuser with the provided email and password
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

# Custom user model extending AbstractBaseUser and PermissionsMixin
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)  # Email address as the unique identifier
    username = models.CharField(max_length=255, unique=True, null=True, blank=True)  # Username
    full_name = models.CharField(max_length=255, blank=True)  # Full name
    date_joined = models.DateTimeField(auto_now_add=True)  # Date when the user joined
    last_login = models.DateTimeField(auto_now=True)  # Date of the last login
    is_active = models.BooleanField(default=True)  # Active status of the user
    is_musician = models.BooleanField(default=False)  # Flag indicating if the user is a musician
    
    # Personal information
    birthdate = models.DateField(null=True, blank=True)  # User's birthdate
    profile_picture = models.URLField(blank=True, null=True)  # URL for the profile picture
    bio = models.TextField(blank=True)  # Biography or description
    
    # Fields related to password reset
    reset_token = models.CharField(max_length=100, blank=True, null=True)  # Token for password reset
    verification_code = models.CharField(max_length=6, blank=True, null=True)  # Verification code for email verification
    code_expiration = models.DateTimeField(blank=True, null=True)  # Expiration time for verification code
    gender = models.CharField(max_length=10, blank=True, null=False)  # User's gender
    is_valid = models.BooleanField(default=True)  # Validity status
    
    # Relationships
    follows = models.ManyToManyField('self', related_name='followed_by', symmetrical=False, blank=True)  # Users that are followed by this user
    favorite_musics = models.ManyToManyField('music.Music', related_name='favorited_by_users', blank=True)  # Favorite music tracks
    favorite_albums = models.ManyToManyField('album.Album', related_name='favorited_by_users_album', blank=True)  # Favorite albums
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)  # IP address of the last login
    location = models.CharField(max_length=255, blank=True, null=True)  # Resolved location based on IP

    @property
    def followers_count(self):
        # Property to get the count of followers
        return self.followed_by.count()

    @property
    def following_count(self):
        # Property to get the count of users being followed
        return self.follows.count()

    objects = CustomUserManager()
    USERNAME_FIELD = 'email'  # The email field is used as the username field
    REQUIRED_FIELDS = ['username']  # Additional required fields

    def __str__(self):
        return self.email  # String representation of the user object
