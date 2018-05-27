from django.conf.urls import url

from modelWebsite.views import getModels, getModelValues, getModelInstance, getModelInstanceJson, deleteModelInstance

urlpatterns = [
    url(r'^getModels/', getModels, name='getModels'),
    url(r'^getModelValues/(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/(?P<offset>[0-9]+)/', getModelValues, name='getModelValues'),

    url(r'^modelInstance/(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/(?P<id>[0-9]+)/', getModelInstance, name='getModelInstance'),
    url(r'^modelInstance/(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/', getModelInstance, name='getModelInstance'),

    url(r'^getModelInstanceJson/(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/(?P<id>[{}a-zA-Z._]+)/', getModelInstanceJson, name='getModelInstance'),
    url(r'^getModelInstanceJson/(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/(?P<id>[0-9]+)/', getModelInstanceJson, name='getModelInstance'),
    url(r'^getModelInstanceJson/(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/', getModelInstanceJson, name='getModelInstance'),

    url(r'^modelInstance/(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/(?P<id>[0-9]+)/delete/', deleteModelInstance, name='deleteModelInstance'),

]
