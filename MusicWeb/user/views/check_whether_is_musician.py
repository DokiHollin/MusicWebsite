from rest_framework import generics
from user.models import CustomUser
from user.serializers import IsMusicianSerializer

class IsMusicianView(generics.RetrieveAPIView):
    # Define the queryset to retrieve all CustomUser objects
    queryset = CustomUser.objects.all()

    # Specify the serializer class to use for the response
    serializer_class = IsMusicianSerializer

    def get_object(self):
        try:
            # Retrieve the CustomUser object based on the user's authentication
            return self.request.user

        except CustomUser.DoesNotExist:
            # Handle the case where the user does not exist
            raise generics.NotFound("User not found")