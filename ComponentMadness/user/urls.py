from django.conf.urls import url
from user.views import GetUser
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


app_name = 'user'

urlpatterns = [
    url(r'^auth/token/obtain/$', TokenObtainPairView.as_view()),
    url(r'^auth/token/refresh/$', TokenRefreshView.as_view()),
    url(r'^authenticate-user/', GetUser)
]
