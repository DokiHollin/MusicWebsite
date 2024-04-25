from rest_framework import serializers
from .models import HomePagePoster

#Serializer for create homepage
class HomePagePosterSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePagePoster
        fields = ['url']