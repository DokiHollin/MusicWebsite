"""
URL configuration for MusicWeb project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from asyncio import Server
from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/music/', include('music.urls')),
    path('api/album/', include('album.urls')),
    path('api/musician/', include('Musician.urls')),
    path('api/user/', include('user.urls')),
    path('api/playlist/', include('playlist.urls')),
    path('api/homepage_poster/', include('homepage_poster.urls')),
    path('api/search/', include('search.urls')),
]
