from datetime import datetime

from django import apps
from user.models import VerificationCode

@apps.task
def clean_expired_codes():
    expired_codes = VerificationCode.objects.filter(expiration_time__lt=datetime.now())
    expired_codes.delete()