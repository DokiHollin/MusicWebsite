from django.urls import path
from user.views.Edit_user_profile_picture import EditUserProfileView, EditUserDetailsAPIView    
from user.views.update_user_ip_and_location import UpdateUserIPandLocation
from user.views.follower_user_list_view import FollowerUsersList
from user.views.remove_album_from_favourite import RemoveFavoriteAlbum
from user.views.list_all_albums_by_userID import UserFavoriteAlbumsListAPIView
from user.views.user_save_album import AddFavoriteAlbum
from user.views.remove_favourite_music_view import RemoveFavoriteMusicView
from user.views.add_favourite_music_view import AddFavoriteMusicView
from user.views.list_user_favourite_music_view import UserFavoriteMusicsView
from user.views.unfollow_user import UnfollowUserView
from user.views.follow_user import FollowUserView
from user.views.following_user_list_view import FollowingUsersList
from user.views.get_user_profile import UserProfile
from user.views.check_whether_is_musician import IsMusicianView
from user.views.resend_email_view import ResendEmailVerificationView
from user.views.get_user_id_by_token import GetUserIDFromTokenAPIView
from user.views.Email_send_view import EmailVerificationView
from user.views.password_reset_views import PasswordResetRequestView, PasswordResetVerifyView
from user.views.user_register_view import CustomUserRegisterView, SuperUserRegisterView

from user.views.Login_views import LoginView
from . import views



urlpatterns = [
    # api for user login
    path('api/login/', LoginView.as_view(), name='login'),
     # api for user register
    path('register/', CustomUserRegisterView.as_view(), name='user-register'),

    # api for superuser/admin register
    path('register/superuser/', SuperUserRegisterView.as_view(), name='superuser-register'),
    
    # api for send code
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    # api for code check and reset passsword
    path('password-reset/verify/', PasswordResetVerifyView.as_view(), name='password-reset-verify'),
    # send email for first register
    path('email-send/', EmailVerificationView.as_view(), name='email-send'),
    #get user_id by token
    path('get-user-id/', GetUserIDFromTokenAPIView.as_view(), name='get_user_id_from_token'),
    #resend verfication email for user
    path('resend-email/', ResendEmailVerificationView.as_view(), name='resend-email'),
    #api for check whether this user is musian
    path('is_musician/<int:pk>/', IsMusicianView.as_view(), name='is-musician'),
    #api for get user profile, argument is user id
    path('<int:user_id>/profile/', UserProfile.as_view(), name='user_profile'),
    
    path('<int:user_id>/following-users/', FollowingUsersList.as_view(), name='following-users-list'),
    # api for follow user 
    path('follow/<int:user_id>/', FollowUserView.as_view(), name='follow-view'),
    # api for unfollow user
    path('unfollow/<int:user_id>/', UnfollowUserView.as_view(), name='unfollow_user'),
    # api for add favourite music to user, arguments: user_id, music_id
    path('add_favorite/', AddFavoriteMusicView.as_view(), name='add-favorite-music'),
    # api for get all favourite musics about this user
    path('<int:user_id>/favorites/', UserFavoriteMusicsView.as_view(), name='user-favorite-musics'),
    # api for user to remove favourite music, argument, user_id,music_id
    path('remove-favorite-music/', RemoveFavoriteMusicView.as_view(), name='remove-favorite-music'),

     # Api for user save album
    path('favorite_album/', AddFavoriteAlbum.as_view(), name='favorite_album'),

    # api for user remove albums from favourite
    path('unfavorite_album/', RemoveFavoriteAlbum.as_view(), name='unfavorite_album'),

    #  api for user list all favorited_albums
    path('<int:user_id>/favorited_albums/', UserFavoriteAlbumsListAPIView.as_view(), name='list_favorited_albums'),
    # api for user list all follower
    path('<int:user_id>/followers/', FollowerUsersList.as_view(), name='follower-users-list'),
    # api for get user ip
    path('update_ip_location/', UpdateUserIPandLocation.as_view(), name='update_ip_location'),
    # api for user to edit profile
    path('edit-profile-detail/', EditUserDetailsAPIView.as_view(), name='edit_user_profile_detail'),
    # api for user to edit profile picture
    path('edit-profile-detail-picture/', EditUserProfileView.as_view(), name='edit_user_profile'),
]