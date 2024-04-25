from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from django.core.exceptions import ValidationError
from album.models import Album
from album.serializers import AlbumSerializer
from rest_framework.permissions import AllowAny

class TopAlbumsByClicks(APIView):
    """
    API endpoint to retrieve top 5 albums based on the total click counts of their musics.
    """
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        try:
            # Aggregate total click counts per album
            albums = Album.objects.annotate(total_clicks=Sum('music__click_count')).order_by('-total_clicks')[:8]
            
            # Serialize the top 5 albums
            serializer = AlbumSerializer(albums, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except ValidationError as e:
            # Handle model validation errors
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            # Handle generic exceptions
            return Response({"detail": "An error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
