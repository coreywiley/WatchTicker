from django.conf.urls import url
from user.views import UserLogin, UserLogout, SignUp

app_name = 'user'

urlpatterns = [
    url(r'^signUp/$', SignUp, name='signUp'),
    url(r'^logIn/$', UserLogin, name='logIn'),
    url(r'^logOut/$', UserLogout, name='logOut')
]
