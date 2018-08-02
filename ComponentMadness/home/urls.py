from django.conf.urls import include, url
from django.views.generic.base import RedirectView
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

from home.views import *
admin.autodiscover()

urlpatterns = [
    #Get context
    url(r'^csrfmiddlewaretoken/$', Context, name='context'),

    #Run React build?

    #Get avaliable pages
    #Manage single page
    url(r'^pageEditor/$', PageEditor, name='pageEditor'),

    #Get avaliable models
    #Manage single model
    url(r'^api/', include('modelWebsite.urls', namespace="api")),

    url(r'^users/', include('user.urls', namespace="user")),
    #url(r'^(?P<url>[a-zA-Z0-9]+)/$', PageDisplay, name='pageDisplay'),

    url(r'^authenticate/$', logIn, name='logIn'),
    url(r'^getProjects/$', getProjects, name='getProjects'),
    url(r'^getQuestions/(?P<project_id>\w+)/$', getQuestions, name='getQuestions'),
    url(r'^getQuestion/(?P<question_id>\w+)/$', getQuestion, name='getQuestion'),
    url(r'^submitGrade/(?P<question_id>\w+)/$', submitGrade, name='submitGrade'),

    #Catch statements for React
    url(r'^$', Index, name='index'),
    url(r'^(?P<param>\w+)/$', Index, name='index'),
    url(r'^(?P<param>\w+)/(?P<param2>\w+)/$', Index, name='index'),
    url(r'^(?P<param>\w+)/(?P<param2>\w+)/(?P<param3>\w+)/$', Index, name='index'),
    url(r'^(?P<param>\w+)/(?P<param2>\w+)/(?P<param3>\w+)/(?P<param4>\w+)/$', Index, name='index'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


