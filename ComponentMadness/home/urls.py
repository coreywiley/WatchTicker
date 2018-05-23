from django.conf.urls import include, url
from django.views.generic.base import RedirectView
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

from home.views import *
admin.autodiscover()

urlpatterns = [
    #Get context
    url(r'^api/$', Context, name='context'),
    #Get avaliable components
    url(r'^api/components/$', ListComponents, name='components'),
    #Manage single component
    url(r'^api/component/(?P<id>[0-9]+)/$', ManageComponent, name='component'),
    #Run React build?

    #Get avaliable pages
    #Manage single page
    url(r'^pageEditor/$', PageEditor, name='pageEditor'),

    #Get avaliable models
    #Manage single model
    url(r'^models/',include('modelWebsite.urls')),

    url(r'^users/',include('user.urls')),
    #url(r'^(?P<url>[a-zA-Z0-9]+)/$', PageDisplay, name='pageDisplay'),

    #Django admin
    url(r'^admin/', include(admin.site.urls)),

    #Catch statements for React
    url(r'^$', Index, name='index'),
    url(r'^(?P<param>\w+)/$', Index, name='index'),
    url(r'^(?P<param>\w+)/(?P<param2>\w+)/$', Index, name='index'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


