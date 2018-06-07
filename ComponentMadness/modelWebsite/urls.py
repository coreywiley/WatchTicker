from django.conf.urls import url

from modelWebsite.views import getModels, getModelInstanceJson, deleteModelInstance, writeComponents, getApps, getModelFieldsJson

urlpatterns = [
    url(r'^(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/(?P<id>[0-9]+)/delete/', deleteModelInstance, name='deleteModelInstance'),
    url(r'^getModels/(?P<appLabel>[a-zA-Z_]+)', getModels, name='getModels'),
    url(r'^getApps/', getApps, name='getApps'),

    url(r'^(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/fields/', getModelFieldsJson, name='getModelFields'),
    url(r'^(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/(?P<id>[{}a-zA-Z._]+)/', getModelInstanceJson, name='getModelInstance'),
    url(r'^(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/(?P<id>[0-9]+)/', getModelInstanceJson, name='getModelInstance'),
    url(r'^(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/', getModelInstanceJson, name='getModelInstance'),


    url(r'^writeComponents/$', writeComponents, name = "writeComponents")

]
