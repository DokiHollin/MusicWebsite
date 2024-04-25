from rest_framework import serializers
from .models import Musician

#Serializer that deal with musician create
class MusicianSerializer(serializers.ModelSerializer):
    class Meta:
        model = Musician
        fields = ['MusicianID', 'UserID', 'MusicianName', 'Genre', 'Bio', 'ProfilePictureURL', 'Region', 'RealName', 'PhoneNumber', 'Nationality', 'OutsidePlatform', 'Nickname', 'PlatformFollowers']