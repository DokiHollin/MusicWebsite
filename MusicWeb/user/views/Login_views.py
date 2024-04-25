from django.shortcuts import render
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
import requests
from user.models import CustomUser

class LoginView(APIView):
    permission_classes = [AllowAny]

    def get_client_ip(self, request):
        # Get the client's IP address from the request
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def get_location_from_ip(self, ip):
        # Get location information from an IP address using an external service
        response = requests.get(f"http://ip-api.com/json/{ip}")
        data = response.json()
        city = data.get("city", "")
        region = data.get("region", "")
        country = data.get("country", "")
        return ", ".join(filter(None, [city, region, country]))

    def post(self, request, *args, **kwargs):
        try:
            email = request.data.get("email")
            password = request.data.get("password")
            
            # Authenticate the user using email and password
            user = authenticate(email=email, password=password)

            if user is not None:
                # Update IP and location after successful authentication
                ip = self.get_client_ip(request)
                user.last_login_ip = ip
                location = self.get_location_from_ip(ip)
                user.location = location
                user.save()

                # Generate or retrieve the user's authentication token
                token, _ = Token.objects.get_or_create(user=user)
                return Response({
                    "token": token.key,
                    "is_superuser": user.is_superuser
                })
            else:
                # Handle the case where authentication fails and return a 400 Bad Request response
                return Response({"error": "Wrong Credentials"}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            # Handle any exceptions that may occur during the authentication process
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
