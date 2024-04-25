
from rest_framework import generics
from music.models import Music
from music.serializers import MusicSerializer

class ActiveMusicListAPIView(generics.ListAPIView):
    """
    API endpoint to retrieve a list of all active music instances.
    """
    queryset = Music.objects.filter(is_active=True)
    serializer_class = MusicSerializer


class InactiveMusicListAPIView(generics.ListAPIView):
    """
    API endpoint to retrieve a list of all inactive music instances.
    """
    queryset = Music.objects.filter(is_active=False)
    serializer_class = MusicSerializer