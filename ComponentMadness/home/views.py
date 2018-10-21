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
from PIL import Image, ImageDraw, ImageFont
#from user.views import my_login_required

@xframe_options_exempt
def Index(request, param = "", param2 = "", param3 = "", param4 = ""):
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

@csrf_exempt
def redeem(request):

    main_image = request.POST['main_image']
    main_image = main_image.replace('/static/images/','')
    txt = request.POST['text']
    txt = txt.replace('+', '\n')

    print (main_image)
    image = Image.open(settings.MEDIA_ROOT + main_image)

    draw = ImageDraw.Draw(image)

    fontsize = 1  # starting font size

    # portion of image width you want text width to be
    img_fraction = 2

    font = ImageFont.truetype("/home/jthiesen1/webapps/patrongate/arialbd.ttf", fontsize)
    while font.getsize(txt)[0] < img_fraction * image.size[0]:
        # iterate until the text size is just larger than the criteria
        fontsize += 1
        font = ImageFont.truetype("/home/jthiesen1/webapps/patrongate/arialbd.ttf", fontsize)

    # optionally de-increment to be sure it is less than criteria

    fontsize -= 1
    x, y = 10, 10
    font = ImageFont.truetype("/home/jthiesen1/webapps/patrongate/arialbd.ttf", fontsize)
    draw.text((x - 1, y - 1), txt, font=font, fill=(0, 0, 0))
    draw.text((x + 1, y - 1), txt, font=font, fill=(0, 0, 0))
    draw.text((x - 1, y + 1), txt, font=font, fill=(0, 0, 0))
    draw.text((x + 1, y + 1), txt, font=font, fill=(0, 0, 0))

    draw.text((x, y), txt, font=font, fill=(255, 255, 255))  # put the text on the image
    image.save(settings.MEDIA_ROOT + request.POST['file_name'])  # save it
    return JsonResponse({'success':True})
