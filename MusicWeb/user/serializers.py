import datetime
from rest_framework import serializers
from user.models import CustomUser
from django.utils import timezone
from playlist.serializers import PlaylistSerializerForProfile

# Serializer for creating and updating user profiles
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password', 'full_name', 'birthdate', 'profile_picture', 'bio')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        # Create a new user with the provided data
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def validate_username(self, value):
        """
        Check if the username is already in use.
        """
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

# Serializer for email verification
class EmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()

# Serializer for creating superusers
class SuperUserSerializer(CustomUserSerializer):
    def create(self, validated_data):
        # Set is_superuser to True when creating a superuser
        validated_data['is_superuser'] = True
        return super().create(validated_data)

# Serializer for initiating a password reset
class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

# Serializer for confirming a password reset
class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField()

# Serializer for updating the 'is_musician' field of a user
class IsMusicianSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['is_musician']

# Serializer for returning user profile information
class UserProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    playlists = PlaylistSerializerForProfile(source='playlist_set', many=True, read_only=True)

    class Meta:
        model = CustomUser
        exclude = ('reset_token', 'verification_code', 'code_expiration')

    def get_followers_count(self, obj):
        # Get the count of followers for the user
        return obj.followed_by.count()

    def get_following_count(self, obj):
        # Get the count of users being followed by the user
        return obj.follows.count()
