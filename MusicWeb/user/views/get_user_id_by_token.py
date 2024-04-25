from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class GetUserIDFromTokenAPIView(APIView):
    authentication_classes = [TokenAuthentication]  # Use Token Authentication for user authentication
    permission_classes = [IsAuthenticated]  # Ensure that only authenticated users can access this view

    def get(self, request):
        try:
            # Retrieve the user ID from the authenticated user's token
            user_id = request.user.id

            # Respond with the user ID in the response
            return Response({'user_id': user_id})

        except Exception as e:
            # Handle any exceptions that may occur during the process
            return Response({'error': f'An error occurred: {str(e)}'}, status=500)