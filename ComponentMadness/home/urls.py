from django.conf.urls import include, url
from django.views.generic.base import RedirectView
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

from home.views import *
admin.autodiscover()

urlpatterns = [
    #Get avaliable pages

    #Get avaliable models
    #modelWesbite app to create rest api
    url(r'^api/', include('modelWebsite.urls', namespace="api")),

    #user imports
    url(r'^users/', include('user.urls', namespace="user")),
    url(r'^nextInQueue/(?P<question_id>\w+)/(?P<user_id>\w+)/$', NextInQueue, name='queue'),
    url(r'^nextInTrialQueue/(?P<question_id>\w+)/(?P<user_id>\w+)/$', NextInTrialQueue, name='queue'),
    #Catch statements for React
    url(r'^$', Index, name='index'),
    url(r'^(?P<param>\w+)/$', Index, name='index'),
    url(r'^(?P<param>\w+)/(?P<param2>\w+)/$', Index, name='index'),
    url(r'^(?P<param>\w+)/(?P<param2>\w+)/(?P<param3>\w+)/$', Index, name='index'),
    url(r'^(?P<param>\w+)/(?P<param2>\w+)/(?P<param3>\w+)/(?P<param4>\w+)/$', Index, name='index'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


