from album.serializers import AlbumSerializer
from album.models import Album
from music.models import Music  
from rest_framework import generics
from S3_uploader import S3Uploader  

#view for delete album
class AlbumDeleteAPIView(generics.DestroyAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    
    def destroy(self, request, *args, **kwargs):
        album = self.get_object()
        uploader = S3Uploader()
        # delete all music related this album first
        for music in Music.objects.filter(Album=album):
            for file_type in ['S3Info', 'S3Lrc', 'S3Music', 'S3Image', 'S3MV']:
                object_url = getattr(music, file_type, None)
                if object_url:
                    file_path = uploader.extract_file_path_from_url(object_url)
                    if file_path:
                        uploader.delete_file(file_path)
            music.delete()

        return super().destroy(request, *args, **kwargs)