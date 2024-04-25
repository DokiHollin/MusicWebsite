from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from S3_uploader import S3Uploader

class EditUserProfileView(APIView):
    uploader = S3Uploader()

    def post(self, request):
        """
        Handles the POST request to edit the user's profile.

        Expected request body:
        - profile_picture (file): The new profile picture for the user.

        Response:
        - Success: JSON response with a success message and the URL of the uploaded profile picture.
        - Failure: JSON response with an error message.
        """
        try:
            user = request.user  # Get the authenticated user

            # Check if the 'profile_picture' file is provided in the request
            profile_picture = request.FILES.get('profile_picture')

            # If the profile_picture is provided
            if profile_picture:
                # Try to upload the profile picture to S3
                url = self.uploader.upload_user_profile_picture(user, profile_picture)

                # If the upload is successful and we receive a URL
                if url:
                    # The URL is already saved in the user's profile by the uploader function
                    return JsonResponse({
                        "message": "Profile updated successfully!",
                        "profile_picture": url
                    })
                else:
                    # If there was an error in uploading the profile picture
                    return JsonResponse({"message": "Error uploading profile picture."}, status=400)
            
            # If no profile_picture is provided in the request
            return JsonResponse({"message": "No profile picture provided."}, status=400)

        # Handle generic exceptions and provide a user-friendly error message
        except Exception as e:
            # Log the exception for debugging purposes
            print(f"Error in EditUserProfileView: {e}")
            return JsonResponse({"message": "An error occurred while processing the request."}, status=500)


class EditUserDetailsAPIView(APIView):
     
    def post(self, request, *args, **kwargs):
        """
        Handles the POST request to edit the user's details.

        Expected request data:
        - bio (str): The updated bio for the user.
        - username (str): The updated username for the user.

        Response:
        - Success: JSON response with a success message.
        - Failure: JSON response with an error message.
        """
        try:
            user = request.user  # Get the authenticated user

            # Extract bio and username from the request data
            bio = request.data.get('bio')
            username = request.data.get('username')

            # Update the user's details if provided
            if bio:
                user.bio = bio
            if username:
                user.username = username

            # Save the user's changes
            user.save()

            return Response({"message": "User details updated successfully!"}, status=status.HTTP_200_OK)

        # Handle generic exceptions and provide a user-friendly error message
        except Exception as e:
            # Log the exception for debugging purposes
            print(f"Error in EditUserDetailsAPIView: {e}")
            return Response({"message": "An error occurred while updating user details."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)