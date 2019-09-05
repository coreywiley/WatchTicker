from django.conf.urls import include, url
from django.views.generic.base import RedirectView
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

from home.views import Index, ReactHotload, RecommendedPrice
admin.autodiscover()

urlpatterns = [
    url(r'^recommendedprice/(?P<reference_number>[A-Za-z0-9-]+)/$', RecommendedPrice),
    #Get avaliable pages
    url(r'^sockjs-node/', ReactHotload, name="dealing_with_react_hotloading"),
    #Get avaliable models
    #modelWesbite app to create rest api
    url(r'^api/', include('modelWebsite.urls', namespace="api")),
    #user imports
    url(r'^users/', include('user.urls', namespace="user")),
    #Catch statements for React
    url(r'^$', Index, name='index'),
    url(r'^(?P<param>\S+)/$', Index, name='index'),
    url(r'^(?P<param>\S+)/$', Index, name='index'),
    url(r'^(?P<param>\S+)/(?P<param2>\S+)/$', Index, name='index'),
    url(r'^(?P<param>\S+)/(?P<param2>\S+)/(?P<param3>\S+)/$', Index, name='index'),
    url(r'^(?P<param>\S+)/(?P<param2>\S+)/(?P<param3>\S+)/(?P<param4>\S+)/$', Index, name='index'),
    url(r'^(?P<param>\S+)/(?P<param2>\S+)/(?P<param3>\S+)/(?P<param4>\S+)/(?P<param5>\S+)/$', Index, name='index'),
    url(r'^(?P<param>\S+)/(?P<param2>\S+)/(?P<param3>\S+)/(?P<param4>\S+)/(?P<param5>\S+)/(?P<param6>\S+)/$', Index, name='index'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


handler404 = 'home.views.NotFoundHandler'
handler500 = 'home.views.ErrorPage'
handler403 = 'home.views.PermissionDenied'
handler400 = 'home.views.BadRequest'
