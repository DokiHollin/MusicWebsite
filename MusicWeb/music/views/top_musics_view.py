from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from music.models import Music
from music.serializers import MusicSerializer
from rest_framework.permissions import AllowAny


class TopMusicView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            # Querying the top 10 active music based on click_count
            top_music = Music.objects.filter(is_active=True).order_by('-click_count')[:10]
            
            # Serializing the music using MusicSerializer
            serializer = MusicSerializer(top_music, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            # If there's any exception, return an error response
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)