from rest_framework import generics, status
from rest_framework.response import Response
from music.models import Music
from music.serializers import MusicSerializer
from music.models import Music
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync




class SetMusicActiveAPIView(generics.UpdateAPIView):
    """
    API endpoint to set a music instance as active.
    """
    queryset = Music.objects.all()
    serializer_class = MusicSerializer

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.is_active = True
            instance.save()

            # If the approval is successful, send the WebSocket message:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "notifications", 
                {
                    'type': 'send_notification',
                    'text': {
                        'message': 'musicUpdated.'
                    }
                }
            )
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)