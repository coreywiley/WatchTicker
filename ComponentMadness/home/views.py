from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse, JsonResponse, Http404, HttpResponseForbidden, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.apps import apps
import django

from modelWebsite.models import Page, Component, PageComponent, Model, Field
from user.views import my_login_required

import datetime
import time
import requests
import csv

import json
import os

#from user.views import my_login_required

def Index(request, param = "", param2 = "", param3 = "", param4 = ""):
    if request.META['HTTP_HOST'] == "localhost:8000":
        #In development mode this connects to the live React Node server
        html = requests.get("http://localhost:3000").content
        html = html.decode().replace('src="/static/js/bundle.js"', 'src="http://localhost:3000/static/js/bundle.js"')
        return HttpResponse(html)

    #html = requests.get("http://mathapp.jthiesen1.webfactional.com").content
    #html = html.decode().replace('src="/static/js/bundle.js"', 'src="http://mathapp.jthiesen1.webfactional.com/static/js/bundle.js"')
    #return HttpResponse(html)
    return render(request, "index.html", {})