from django.urls import path
from .views import SearchAPIView

urlpatterns = [
    # api for search
    path('search/', SearchAPIView.as_view(), name='search_api'),
]