from django.urls import path
from homepage_poster.views.list_all_poster_view import ListAllPostersAPIView
from homepage_poster.views.upload_poster_view import UploadPosterView

urlpatterns = [
    # upload_poster api, arguments : url: form data image, uploaded_at : datetime
    path('upload_poster/', UploadPosterView.as_view(), name='upload_poster'),

    # api for return all posters in db
    path('posters/', ListAllPostersAPIView.as_view(), name='all-posters-list'),
]