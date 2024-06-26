import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Called when the WebSocket is handshaking as part of the connection process.
        await self.accept()

    async def disconnect(self, close_code):
        # Called when the WebSocket closes for any reason.
        pass

    async def receive(self, text_data):
        # Called when the server receives a message from the WebSocket.
        pass

    async def send_notification(self, event):
        # Called to send a notification to the WebSocket.
        await self.send(text_data=json.dumps(event["txt"]))
