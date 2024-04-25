from datetime import datetime, timedelta
from random import randint

from rest_framework import permissions
from rest_framework.response import Response
from user.Services.MailgunMailer import MailgunMailer
from user.models import CustomUser
from user.serializers import EmailVerificationSerializer
from django.core.mail import send_mail
from rest_framework import generics, status
from django.utils import timezone

class EmailVerificationView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = EmailVerificationSerializer

    def create(self, request, *args, **kwargs):
        try:
            # Initialize the Mailgun mailer
            mailer = MailgunMailer("creativeharmony.info", "0fbe34b69ecf0518aef3745f6b697b45-3750a53b-d19513e7")
            
            # Get the email from the request data
            email = request.data.get('email')

            # Check if the email already exists in CustomUser
            if CustomUser.objects.filter(email=email).exists():
                return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

            # Generate a random verification code
            verification_code = str(randint(100000, 999999))

            # Create a new CustomUser with the verification code and expiration time
            user = CustomUser(email=email, verification_code=verification_code, code_expiration=timezone.now() + timedelta(minutes=15))
            user.save()

            # Send an email with the verification code
            mailer.send_email(
                "harmony@creativeharmony.info",
                [email],
                'Registration Verification Code',
                f'Your verification code for registration is: {verification_code}',
            )

            return Response({"message": "Verification code sent to email."})

        except Exception as e:
            # Handle any exceptions that may occur during the process
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
