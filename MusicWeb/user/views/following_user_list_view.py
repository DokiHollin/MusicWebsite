from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.models import CustomUser
from user.serializers import UserProfileSerializer

class FollowingUsersList(APIView):
    """
    A view that returns a list of users that a user specified by user_id in the URL is following.
    """
    def get(self, request, user_id, format=None):
        try:
            specific_user = CustomUser.objects.get(pk=user_id)  # Fetch the user specified by user_id
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            
        followed_users = specific_user.follows.all()  # Fetch all users that the specified user follows
        serializer = UserProfileSerializer(followed_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)