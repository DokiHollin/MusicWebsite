from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.models import CustomUser
from user.serializers import UserProfileSerializer

class FollowerUsersList(APIView):
    """
    A view that returns a list of users following a user specified by user_id in the URL.
    """
    def get(self, request, user_id, format=None):
        try:
            specific_user = CustomUser.objects.get(pk=user_id)  # Fetch the user specified by user_id
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
        followers = specific_user.followed_by.all()  # Fetch all users that follow the specified user
        serializer = UserProfileSerializer(followers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)