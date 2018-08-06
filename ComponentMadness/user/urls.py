from django.conf.urls import url
from user.views import UserLogin, UserLogout, SignUp
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

app_name = 'user'

urlpatterns = [
    url(r'^signUp/$', SignUp, name='signUp'),
    url(r'^logIn/$', UserLogin, name='logIn'),
    url(r'^logOut/$', UserLogout, name='logOut'),

    url(r'^api-token-auth/', obtain_jwt_token),
    url(r'^api-token-refresh/', refresh_jwt_token),

]
