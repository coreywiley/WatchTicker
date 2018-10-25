from django.conf.urls import url
from user.views import GetUser, UserSignUp, CheckForUser, ResetPassword
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)




app_name = 'user'

urlpatterns = [
    url(r'^auth/token/obtain/$', TokenObtainPairView.as_view()),
    url(r'^auth/token/refresh/$', TokenRefreshView.as_view()),
    url(r'^token/$', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    url(r'^token/refresh/$', TokenRefreshView.as_view(), name='token_refresh'),
    url(r'^user/$', GetUser, name='getUser'),
    url(r'^userCheck/$', CheckForUser, name='CheckForUser'),
    url(r'^signup/$', UserSignUp, name='UserSignUp'),
    url(r'^resetPassword/(?P<user_id>\S+)/$', ResetPassword, name='resetPassword'),
]
