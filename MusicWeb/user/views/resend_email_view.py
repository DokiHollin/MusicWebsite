from datetime import datetime, timedelta
from random import randint

from rest_framework import permissions
from rest_framework.response import Response
from user.serializers import EmailVerificationSerializer
from user.Services.MailgunMailer import MailgunMailer
from user.models import CustomUser
from rest_framework import generics, status
from django.utils import timezone

class ResendEmailVerificationView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    # Use the same serializer because we only need the email field
    serializer_class = EmailVerificationSerializer

    def create(self, request, *args, **kwargs):
        try:
            mailer = MailgunMailer("creativeharmony.info", "0fbe34b69ecf0518aef3745f6b697b45-3750a53b-d19513e7")
            email = request.data.get('email')

            # Get the corresponding user
            user = CustomUser.objects.filter(email=email).first()
            
            # If the user does not exist, return an error
            if not user:
                return Response({"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST)

            # Generate a new 6-digit random verification code
            new_verification_code = str(randint(100000, 999999))
            user.verification_code = new_verification_code
            user.code_expiration = timezone.now() + timedelta(minutes=15)
            user.save()

            # Resend the verification code email
            mailer.send_email(
                "harmony@creativeharmony.info",
                [email],
                'Resend Registration Verification Code',
                f'Your new verification code for registration is: {new_verification_code}',
            )
            return Response({"message": "New verification code sent to email."})
        
        except Exception as e:
            # Handle any exceptions that may occur during the email verification resend process
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
