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

    if request.method == "POST":
        email = request.POST['email']
        password = request.POST['password']
        passwordCheck = request.POST['passwordCheck']
        imageUrl = request.POST['imageUrl']
        redirect = request.POST['redirectLocation']
        print ('hi')
        userCheck = User.objects.filter(email=email).first()
        if userCheck:
            return HttpResponseRedirect(request.META.HTTP_REFERER + '?error=Email already taken.')
        if password != passwordCheck:
            return HttpResponseRedirect(request.META.HTTP_REFERER + '?error=Passwords Dont Match.')

        userManager = UserManager()
        userManager.create_user(email=email, password=password, imageUrl=imageUrl)
        user = authenticate(email=email, password=password)

        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect(redirect)
                # Redirect to a success page.
            else:
                pass
                # Return a 'disabled account' error message

        return HttpResponseRedirect(redirect)

@csrf_exempt
def UserLogin(request):
    if request.method == "GET":
        if 'email' in request.GET and 'password' in request.GET:
            email = request.GET['email']
            password = request.GET['password']
            redirect = request.GET['redirectLocation']
        else:
            failed = False
            if 'error' in request.GET:
                error = request.GET['error']
            return HttpResponseRedirect(request.META.HTTP_REFERER + '?error=Cannot Find User')
    if request.method == "POST":
        email = request.POST['email']
        password = request.POST['password']
        redirect = request.POST['redirectLocation']

    user = authenticate(email=email, password=password)

    if user is not None:
        if user.is_active:
            login(request, user)
            return HttpResponseRedirect(redirect)
            # Redirect to a success page.
        else:
            pass
            # Return a 'disabled account' error message
    else:
        return JsonResponse({'user':model_to_dict(user)})