from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.models import CustomUser
from user.serializers import UserProfileSerializer

class UserProfile(APIView):

    def get(self, request, user_id):
        try:
            # Retrieve the user object with the provided user_id
            user = CustomUser.objects.get(pk=user_id)
            
            # Serialize the user object using the UserProfileSerializer
            serializer = UserProfileSerializer(user)
            
            # Respond with the serialized user data and a 200 OK status
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except CustomUser.DoesNotExist:
            # Handle the case where the user does not exist and return a 404 Not Found response
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
