from django.forms import ValidationError
from rest_framework import generics
from rest_framework.response import Response
from music.models import Music
from music.serializers import MusicSerializer
import random
from rest_framework.permissions import AllowAny

class RandomMusicView(generics.ListAPIView):
    """
    API endpoint to retrieve a random list of active music instances.
    """
    serializer_class = MusicSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        """
        Return a list of random music instances.
        """
        musics = list(Music.objects.filter(is_active=True))
        if not musics:
            raise ValidationError(message="No active music found.")
        return random.sample(musics, min(len(musics), 4))

