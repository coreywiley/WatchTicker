from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse, JsonResponse, Http404, HttpResponseForbidden, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.apps import apps
import django
from django.conf import settings

import datetime
import time
import requests
import csv

import json
import os
from django.views.decorators.clickjacking import xframe_options_exempt
#from user.views import my_login_required

@xframe_options_exempt
def Index(request, param = "", param2 = "", param3 = "", param4 = "", param5 = "", param6 = ""):
    if request.META['HTTP_HOST'] == "localhost:8000":
        #In development mode this connects to the live React Node server
        html = requests.get("http://localhost:3000").content
        html = html.decode().replace('src="/static/js/bundle.js"', 'src="http://localhost:3000/static/js/bundle.js"')
        return HttpResponse(html)

    return render(request, "index.html", {})

def ErrorPage(request):
    return JsonResponse({'error':'There was an error on the server. Our team has received an email detailing the error and will get it fixed as soon as possible.'})

def NotFoundHandler(request, exception):
    return JsonResponse({'error':"This page doesn't exist. :O"})

def PermissionDenied(request):
    return JsonResponse({'error':'You do not have permission to view this page.'})

def BadRequest(request):
    return JsonResponse({'error':'Bad Request'})