from django.db import models


# Create your models here.
from django.db import models

class HomePagePoster(models.Model):
    url = models.URLField(verbose_name="S3 URL")
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name="Uploaded At")

    def __str__(self):
        return self.url