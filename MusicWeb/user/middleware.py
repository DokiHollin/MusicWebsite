from user.models import CustomUser
from datetime import datetime

class AutoCleanupMiddleware:
    def __init__(self, get_response):
        # Initialize the middleware with the get_response function
        self.get_response = get_response

    def __call__(self, request):
        # Get expired user accounts based on the code_expiration field
        expired_users = CustomUser.objects.filter(code_expiration__lt=datetime.now())

        # Delete expired user accounts from the database
        expired_users.delete()

        # Continue processing the request
        response = self.get_response(request)

        return response
