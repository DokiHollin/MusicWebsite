from rest_framework import serializers
from S3_reader import S3Reader

from music.models import Music


#Serializer for all attribute
class MusicSerializer(serializers.ModelSerializer):
    artist_name = serializers.SerializerMethodField()
    album_name = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    release_year = serializers.SerializerMethodField()
    class Meta:
        model = Music
        fields = ('MusicID', 'Musician', 'Album', 'S3Lrc', 'S3Music', 'Only_for_vip', 'S3Image', 'S3MV', 'click_count', 'is_active', 'artist_name', 'duration',"album_name","music_name","release_year","image","release_year")

    
    def get_release_year(self, obj):
        return obj.Album.release_date
    def get_image(self, obj):
        return obj.Album.album_picture_url
    
    def get_artist_name(self, obj):
        return obj.Musician.MusicianName

    
    def get_album_name(self, obj):
        return obj.Album.album_name
    


# Serializer for part of attribute
class MusicSerializerforDetails(serializers.ModelSerializer):
    artist_name = serializers.SerializerMethodField()
    album_name = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    release_year = serializers.SerializerMethodField()

    class Meta:
        model = Music
        fields = ('music_name', 'artist_name', 'duration', 'album_name',"image","release_year"),
    

    def get_release_year(self, obj):
        return obj.Album.release_date
    def get_image(self, obj):
        return obj.Album.album_picture_url
    
    def get_artist_name(self, obj):
        return obj.Musician.MusicianName

    
    def get_album_name(self, obj):
        return obj.Album.album_name
    
    
    
