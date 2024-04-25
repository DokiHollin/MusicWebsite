from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from socket.consumers import NotificationConsumer

# Define WebSocket URL patterns
websocket_urlpatterns = [
    path('ws/notifications/', NotificationConsumer.as_asgi()),  # Route WebSocket connections to the NotificationConsumer
]

# Create the application with ProtocolTypeRouter for handling WebSocket connections
application = ProtocolTypeRouter({
    'websocket': URLRouter(websocket_urlpatterns),  # Map WebSocket URLs to their respective consumers
})