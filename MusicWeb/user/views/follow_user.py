from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from user.models import CustomUser
from rest_framework.views import APIView

class FollowUserView(APIView):
    
    def post(self, request, user_id, *args, **kwargs):
        try:
            # Get the user to follow using the provided user_id
            user_to_follow = get_object_or_404(CustomUser, pk=user_id)
            
            # Check if the requesting user is trying to follow themselves
            if request.user == user_to_follow:
                return JsonResponse({'error': 'You cannot follow yourself'}, status=400)

            # Add the user_to_follow to the list of users followed by the requesting user
            request.user.follows.add(user_to_follow)
            
            # Respond with a success message
            return JsonResponse({'message': f'Successfully followed {user_to_follow.email}'})
        
        except CustomUser.DoesNotExist:
            # Handle the case where the user to follow does not exist
            return JsonResponse({'error': 'User not found'}, status=404)
        
        except Exception as e:
            # Handle any other exceptions that may occur
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
