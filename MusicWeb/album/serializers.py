from rest_framework import serializers
from .models import Album

#serializer for album
class AlbumSerializer(serializers.ModelSerializer):
    musician_name = serializers.CharField(source='musician.MusicianName', read_only=True)

    class Meta:
        model = Album
        fields = ['album_id', 'musician', 'album_name', 'release_date', 'genre', 'album_picture_url', 'bio', 'musician_name']  # 添加bio字段