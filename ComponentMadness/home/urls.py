from django.conf.urls import include, url
from django.views.generic.base import RedirectView
from django.contrib import admin

from home.views import PageEditor, PageDisplay
admin.autodiscover()

urlpatterns = [
    url(r'^pageEditor/', PageEditor, name='pageEditor'),
    url(r'^models/',include('modelWebsite.urls')),
    url(r'^users/',include('user.urls')),
    url(r'^(?P<url>[a-zA-Z0-9]+)/$', PageDisplay, name='pageDisplay'),
]


