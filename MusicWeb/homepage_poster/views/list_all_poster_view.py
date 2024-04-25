from rest_framework import generics
# Import necessary modules and classes
from rest_framework.exceptions import NotFound  # Import the NotFound exception class for handling resource not found cases
from homepage_poster.models import HomePagePoster  # Import HomePagePoster model for fetching poster data from the database
from homepage_poster.serializers import HomePagePosterSerializer  # Import HomePagePosterSerializer for serializing poster data
from rest_framework.permissions import AllowAny  # Import the AllowAny permission class to allow any user to access this view

# Create a view class for listing all posters
class ListAllPostersAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]  # Set the view's permission classes to allow any user to access
    serializer_class = HomePagePosterSerializer  # Set the serializer class for the view, which will serialize the data to JSON

    # Define the view's queryset method to fetch the data to be displayed
    def get_queryset(self):
        # Query all poster data from the database
        posters = HomePagePoster.objects.all()

        # Exception handling: If no poster data is found, raise a NotFound exception
        if not posters.exists():
            raise NotFound(detail="No posters found.")  # Raise a NotFound exception with the error message "No posters found."

        return posters  # Return the poster data queryset
