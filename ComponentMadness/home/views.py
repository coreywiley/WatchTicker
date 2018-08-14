from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse, JsonResponse, Http404, HttpResponseForbidden, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.apps import apps
import django

from home.models import Test,Question,Answer,Analysis
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

    html = requests.get("http://mathapp.jthiesen1.webfactional.com").content
    html = html.decode().replace('src="/static/js/bundle.js"', 'src="http://mathapp.jthiesen1.webfactional.com/static/js/bundle.js"')
    return HttpResponse(html)

def NextInQueue(request, question_id, user_id):
    question = Question.objects.filter(id=question_id).first()
    test = question.test
    analyses_per_response = test.analyses_per_response

    answer = Answer.objects.filter(completed_analyses__lt=analyses_per_response, question=question_id).exclude(analyses__user=user_id).first()
    #active_analyses__lt = analyses_per_response,
    if answer:
        answer.active_analyses = answer.active_analyses + 1
        answer.last_completed_analysis = datetime.datetime.now()
        answer.save()
        return JsonResponse({'answer':answer.dict(),'question':question.dict()})
    else:
        five_minutes_ago = datetime.datetime.now() - datetime.timedelta(minutes=5)
        answer = Answer.objects.filter(completed_analyses__lt=analyses_per_response, question=question_id, last_completed_analysis__lte=five_minutes_ago).exclude(analyses__user=user_id).first()
        if answer:
            answer.active_analyses = answer.active_analyses + 1
            answer.last_completed_analysis = datetime.datetime.now()
            answer.save()
            return JsonResponse({'answer': answer.dict(), 'question': question.dict()})
        else:
            return JsonResponse({'error':'Answers Are Completed'})

def NextInTrialQueue(request, question_id, user_id):
    question = Question.objects.filter(id=question_id).first()
    test = question.test
    analyses_per_response = test.analyses_per_response

    answer = Answer.objects.filter(question=question_id).exclude(analyses__user=user_id).first()
    #active_analyses__lt = analyses_per_response,
    if answer:
        answer.active_analyses = answer.active_analyses + 1
        answer.last_completed_analysis = datetime.datetime.now()
        answer.save()
        return JsonResponse({'answer':answer.dict(),'question':question.dict()})
    else:
        return JsonResponse({'error':'Answers Are Completed'})
