from rest_framework import generics, permissions
from rest_framework.response import Response
from user.models import CustomUser
from user.serializers import CustomUserSerializer, SuperUserSerializer
from rest_framework import status
from django.db.models import Q
from django.utils import timezone

# Normal user registration view
class CustomUserRegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomUserSerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        submitted_code = request.data.get('verification_code')
        gender = request.data.get('gender')

        try:
            # Check if username or email already exists
            if CustomUser.objects.filter(Q(username=username)).exists():
                return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

            user = CustomUser.objects.get(email=email)

            # Check if the submitted verification code matches
            if user.verification_code != submitted_code:
                return Response({"error": "Invalid verification code."}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the verification code has expired
            if timezone.now() > user.code_expiration:
                return Response({"error": "Verification code has expired."}, status=status.HTTP_400_BAD_REQUEST)

            user.username = username
            user.set_password(password)
            user.verification_code = None
            user.code_expiration = None
            user.gender = gender
            user.save()

            return Response({"message": "User registered successfully."})

        except Exception as e:
            # Handle any exceptions that may occur during the registration process
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Admin user registration view
class SuperUserRegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = SuperUserSerializer
