from rest_framework import generics, status
from rest_framework.response import Response
from user.Services.MailgunMailer import MailgunMailer
from user.models import CustomUser
from user.serializers import PasswordResetSerializer, PasswordResetConfirmSerializer
from random import randint
from datetime import datetime, timedelta
from rest_framework import permissions
from django.core.mail import send_mail
from django.utils import timezone

class PasswordResetRequestView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetSerializer

    def create(self, request, *args, **kwargs):
        try:
            mailer = MailgunMailer("creativeharmony.info", "0fbe34b69ecf0518aef3745f6b697b45-3750a53b-d19513e7")
            
            # Get the 'email' field from the request data
            email = request.data.get('email')
            
            # Try to retrieve the user associated with the provided email from the database
            user = CustomUser.objects.filter(email=email).first()
            
            # If the user is not found, return an error response
            if not user:
                return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Generate a random 6-digit verification code
            verification_code = str(randint(100000, 999999))
            
            # Save the verification code and its expiration time in the user model
            user.verification_code = verification_code
            user.code_expiration = datetime.now() + timedelta(minutes=15)
            user.save()
            
            # Send an email with the verification code for password reset
            mailer.send_email(
                "harmony@creativeharmony.info",
                [email],
                'Password Reset Verification Code',
                f'Your verification code for password reset is: {verification_code}',
            )
            
            return Response({"message": "Verification code sent to email."})
        
        except Exception as e:
            # Handle any exceptions that may occur during the password reset request process
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PasswordResetVerifyView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetConfirmSerializer
    
    def create(self, request, *args, **kwargs):
        try:
            # Get the 'email', 'verification_code', and 'new_password' fields from the request data
            email = request.data.get('email')
            verification_code = request.data.get('verification_code')
            new_password = request.data.get('new_password')
            
            # Try to retrieve the user associated with the provided email from the database
            user = CustomUser.objects.filter(email=email).first()
            
            # If the user does not exist or the verification code does not match, return an error response
            if not user or user.verification_code != verification_code:
                return Response({"error": "Invalid verification code."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if the verification code has expired
            if timezone.now() > user.code_expiration:
                return Response({"error": "Verification code has expired."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Set the new password and clear the verification code and expiration time
            user.set_password(new_password)
            user.verification_code = None
            user.code_expiration = None
            user.save()
            
            return Response({"message": "Password reset successful."})
        
        except Exception as e:
            # Handle any exceptions that may occur during the password reset verification process
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
