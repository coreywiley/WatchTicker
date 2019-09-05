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
from home.models import Watch, Watch_Instance, WatchRequest
import statistics

@xframe_options_exempt
def Index(request, param = "", param2 = "", param3 = "", param4 = "", param5 = "", param6 = ""):
    if request.META['HTTP_HOST'] == "localhost:8000":
        # In development mode this connects to the live React Node server
        html = requests.get("http://localhost:3000").content
        html = html.decode()
        html = html.replace('/manifest.json"', 'http://localhost:3000/manifest.json"')
        html = html.replace('/static/js/', 'http://localhost:3000/static/js/')
        html = html.replace('/static/css/', 'http://localhost:3000/static/css/')
        return HttpResponse(html)

    return render(request, "index.html", {})

def ReactHotload(request):
    return JsonResponse({'success':200})

def ErrorPage(request):
    return JsonResponse({'error':'There was an error on the server. Our team has received an email detailing the error and will get it fixed as soon as possible.'})

def NotFoundHandler(request, exception):
    return JsonResponse({'error':"This page doesn't exist. :O"})

def PermissionDenied(request):
    return JsonResponse({'error':'You do not have permission to view this page.'})

def BadRequest(request):
    return JsonResponse({'error':'Bad Request'})

def RecommendedPrice(request, reference_number):
    watch = Watch.objects.filter(reference_number=reference_number).first()
    if not watch:
        return JsonResponse({'error': 'No watch match to that reference number'})

    watch_instances = Watch_Instance.objects.filter(watch=watch, wholesale=False)
    if watch_instances.count() == 0:
        return JsonResponse({'error': 'We have no data around that watch.'})

    price_list = []
    for instance in watch_instances:
        price_list.append(instance.price)

    first_median = statistics.median(price_list)
    abs_list = []
    for price in price_list:
        abs_list.append(abs(price-first_median))
    mad = statistics.median(abs_list)

    return JsonResponse({'error':'None', 'median_absolute_deviation': mad, 'median':first_median})