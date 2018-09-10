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

from modelWebsite.helpers.jsonGetters import getInstanceJson
from modelWebsite.views import createAndUpdateModel
from user.permissions import IsPostOrIsAuthenticated


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def GetUser(request):
    userData = {}

    if request.user.is_authenticated:
        userData = getInstanceJson('user', 'user', request.user)[0]['user']

    return JsonResponse(userData)


@api_view(['POST'])
@permission_classes((IsPostOrIsAuthenticated, ))
def UserSignUp(request):
    instances = createAndUpdateModel(request._request, 'user', 'user', [])

    return JsonResponse(instances, safe=False)


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