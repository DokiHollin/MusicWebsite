from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from user.models import CustomUser
from rest_framework.views import APIView

class UnfollowUserView(APIView):
    
    def post(self, request, user_id, *args, **kwargs):
        try:
            user_to_unfollow = get_object_or_404(CustomUser, pk=user_id)
            
            # Check if the user is trying to unfollow themselves
            if request.user == user_to_unfollow:
                return JsonResponse({'error': 'You cannot unfollow yourself'}, status=400)
            
            # Remove the user from the follows list
            request.user.follows.remove(user_to_unfollow)
            
            return JsonResponse({'message': f'Successfully unfollowed {user_to_unfollow.email}'})
        
        except Exception as e:
            # Handle any exceptions that may occur during the unfollow process
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
