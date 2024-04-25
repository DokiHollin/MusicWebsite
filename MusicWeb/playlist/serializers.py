from rest_framework import serializers
from playlist.models import Playlist

from music.models import Music



#serializer for delete music from playlist and add music to playlist
class MusicToPlaylistSerializer(serializers.Serializer):
    music_id = serializers.IntegerField()
    playlist_id = serializers.IntegerField()






# serializer for select all music in this playlist
class ListAllMusicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Music
        fields = '__all__'  


# serializer for create playlist
class PlaylistCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = ['User_ID', 'Playlist_Name', 'Description'] 



class PlaylistSerializerForProfile(serializers.ModelSerializer):
    first_song_image = serializers.SerializerMethodField()

    class Meta:
        model = Playlist
        fields = ('Playlist_ID', 'Playlist_Name', 'Description', 'Visibility', 'first_song_image')
    
    def get_first_song_image(self, obj):
 
        first_song = obj.musics.first()
     
        return first_song.S3Image if first_song else None