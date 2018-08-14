from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponseForbidden, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django import forms
from django.forms.models import model_to_dict

from django.conf import settings
from user.models import UserManager, User
import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes

from rest_framework.permissions import IsAuthenticated
# Create your views here.
def my_login_required(function):
    def wrapper(request, *args, **kw):
        if not (request.user and request.user.is_authenticated):
            return HttpResponseRedirect('/users/logIn/')
        else:
            return function(request, *args, **kw)
    return wrapper

def staff_required(function):
    def wrapper(request, *args, **kw):
        if not (request.user and request.user.is_authenticated and request.user.is_superuser):
            return HttpResponseRedirect('/users/logIn/')
        else:
            return function(request, *args, **kw)
    return wrapper

def GetUser(request):
    email = request.POST['email']
    password = request.POST['password']

    user = authenticate(username=email, password=password)
    if not user:
        return JsonResponse({'error':'No user found.'})
    else:
        return JsonResponse({'user':model_to_dict(user)})