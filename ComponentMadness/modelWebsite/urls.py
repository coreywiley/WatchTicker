from django.conf.urls import url

from modelWebsite.views import getModels, getModelInstanceJson, deleteModelInstance, \
    getApps, getModelFieldsJson, writeComponents, CSRFMiddlewareToken, SendEmail

app_name = 'api'

urlpatterns = [
    #Get context
    url(r'^csrfmiddlewaretoken/$', CSRFMiddlewareToken, name='context'),
    url(r'^(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/(?P<id>[0-9]+)/delete/$', deleteModelInstance, name='deleteModelInstance'),
    url(r'^getModels/(?P<appLabel>[a-zA-Z_]+)', getModels, name='getModels'),
    url(r'^getApps/', getApps, name='getApps'),

    url(r'^(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/fields/', getModelFieldsJson, name='getModelFields'),
    url(r'^(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/(?P<id>[0-9]+)/$', getModelInstanceJson, name='getModelInstance'),
    url(r'^(?P<appLabel>[a-zA-Z]+)/(?P<modelName>[a-zA-Z_]+)/$', getModelInstanceJson, name='getModelInstance'),

    url(r'^writeComponents/$', writeComponents, name = "writeComponents"),
    url(r'^email/$', SendEmail, name='email'),

]
