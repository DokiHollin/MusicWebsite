from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user.models import CustomUser
import requests

class UpdateUserIPandLocation(APIView):

    def get_client_ip(self, request):
        # Get the client's IP address from request headers
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def get_location_from_ip(self, ip):
        # Use an external service to get location information based on IP
        response = requests.get(f"http://ip-api.com/json/{ip}")
        data = response.json()
       
        city = data.get("city", "")
        region = data.get("region", "")
        country = data.get("country", "")
        return ", ".join(filter(None, [city, region, country])) 

    def post(self, request):
        try:
            user = request.user

            # Get the user's IP
            ip = self.get_client_ip(request)
            user.last_login_ip = ip
            
            # Get location information from the user's IP
            location = self.get_location_from_ip(ip)
            user.location = location

            user.save()

            return Response({"message": "IP and location updated successfully!"}, status=status.HTTP_200_OK)

        except Exception as e:
            # Handle any exceptions that may occur during the update process
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
