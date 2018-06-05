from django.conf.urls import url

from modelWebsite.views import getModels, getModelInstanceJson, deleteModelInstance, writeComponents

app_name = 'api'

urlpatterns = [
    url(r'^(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/(?P<id>[0-9]+)/delete/$', deleteModelInstance, name='deleteModelInstance'),
    url(r'^getModels/$', getModels, name='getModels'),

    url(r'^(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/(?P<id>[{}a-zA-Z._]+)/$', getModelInstanceJson, name='getModelInstance'),
    url(r'^(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/(?P<id>[0-9]+)/$', getModelInstanceJson, name='getModelInstance'),
    url(r'^(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/$', getModelInstanceJson, name='getModelInstance'),

    url(r'^writeComponents/$', writeComponents, name = "writeComponents")

]
