from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserRegistrationView, UserProfileView, UserListView, UserDeleteView,UserDetailView

app_name = 'users'

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/<str:username>/', UserDetailView.as_view(), name='profile-detail'),
    path('list/', UserListView.as_view(), name='user_list'),
    path('users/<int:pk>/', UserDeleteView.as_view(), name='user_delete'),
]