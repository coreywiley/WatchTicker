from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse, JsonResponse, Http404, HttpResponseForbidden, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.apps import apps
import django

from modelWebsite.models import Page, Component, PageComponent, Model, Field
from user.views import my_login_required
import home.helpers.googleSheets as gsheets

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

def Context(request):
    # Gather context and send it to React
    csrfmiddlewaretoken = django.middleware.csrf.get_token(request)
    return JsonResponse({'csrfmiddlewaretoken':csrfmiddlewaretoken}, status=200)

def PageEditor(request):
    if request.method == "GET":
        components = Component.objects.filter()
        componentDataFields = ComponentDataField.objects.filter()

        componentList = []
        detailedComponents = {}
        for component in components:
            temp = {'id': component.id, 'name':component.name,'description':component.description, 'fields':[]}
            tempData = {}
            for dataField in componentDataFields:
                print (dataField.component_id_id)
                print (component.name)
                if dataField.component_id_id == component.id:
                    temp['fields'].append({'name':dataField.name})
                    tempData[dataField.name] = {'html_id':dataField.html_id, 'attribute_to_change':dataField.attribute_to_change}
            detailedComponents[component.name] = {'id':component.id,'html':component.html,'dataStructure':tempData}
            componentList.append(temp)

        fieldDict = {}
        for field in Field.objects.all():
            if field.model_id not in fieldDict:
                fieldDict[field.model_id] = []
            tempField = {'name':field.name,'id':field.id,'fieldType':field.fieldType,'default':field.default,'blank':field.blank,'model_id':field.model_id}
            fieldDict[field.model_id].append(tempField)

        modelDicts = []
        for model in Model.objects.all():
            modelDicts.append({'name':model.name, 'id':model.id, 'fields': fieldDict[model.id]})
            print (fieldDict[model.id])

        return render(request, 'pageEditor.html', {'componentList':componentList, 'detailedComponents':detailedComponents, 'modelDicts':modelDicts})


    elif request.method == "POST":
        #some sort of saving

        requestData = json.loads(request.POST['componentData'])
        name = request.POST['name']
        url = request.POST['url']
        components = requestData['components']

        page = Page()
        page.name = name
        page.url = url
        page.save()


        i = 0
        for component in components:
            componentCheck = Component.objects.filter(id=int(component['id'])).first()
            tempComponent = PageComponent()
            tempComponent.page_id = page
            tempComponent.component_id = componentCheck
            tempComponent.order = i
            i += 1

            if 'data_url' in component and component['data_url'] != '':
                tempComponent.data_url = component['data_url']

            if 'data' in component and component['data'] != {}:
                tempComponent.data = component['data']

            tempComponent.save()
        return JsonResponse({'success':True})


def PageDisplay(request, url):
    user = None
    if request.user.is_authenticated:
        user = request.user


    query_split = [x.split('=') for x in request.META['QUERY_STRING'].split('&')]

    parameters = {}

    if query_split[0][0] != '':
        for param in query_split:
            parameters['{{'+param[0]+'}}'] = param[1]

    if user and '{{userId}}' not in parameters:
        parameters['{{userId}}'] = user.id

    page = Page.objects.filter(url=url).first()

    pageComponents = PageComponent.objects.filter(page_id=page.id).order_by('order')

    componentDataFields = ComponentDataField.objects.filter()

    buildComponents = []
    for pageComponent in pageComponents:
        print ("I'm Here!!")
        component = Component.objects.filter(id=pageComponent.component_id_id).first()
        temp = {'name': component.name, 'description': component.description, 'fields': []}
        tempData = {}
        for dataField in componentDataFields:
            if dataField.component_id_id == component.id:
                temp['fields'].append({'name': dataField.name})
                tempData[dataField.name] = {'html_id':dataField.html_id,'attribute_to_change':dataField.attribute_to_change}

        if pageComponent.data_url != '':
            buildComponents.append({'html': component.html, 'dataStructure': tempData, 'data_url':pageComponent.data_url})
        else:
            if isinstance(pageComponent.data, str):
                jsonStr = pageComponent.data.replace("'",'"')
                jsonObj = json.loads(jsonStr)
            else:
                jsonObj = pageComponent.data
            buildComponents.append({'html': component.html, 'dataStructure': tempData, 'data': jsonObj})


        models = Model.objects.all()
        fields = Field.objects.all()

        modelDict = {}
        for model in models:
            modelDict[model.id] = {'id':model.id, 'name':model.name, 'fields':[]}

        for field in fields:
            fieldItems = {'id':field.id, 'name': field.name, 'fieldType':field.fieldType, 'default': field.default, 'blank':field.blank}
            modelDict[field.model_id]['fields'].append(fieldItems)

    return render(request, 'pageBuilder.html',{'buildComponents': buildComponents, 'parameters':parameters, 'modelDict':modelDict})


def logIn(request):
    email = request.POST['email']
    users = gsheets.get('Users')
    for user in users:
        if user[1] == email:
            return JsonResponse({'user_id':user[0], 'user_name': user[2] + ' ' + user[3], 'user_shorthand':user[4]})
    return JsonResponse({'error':'User Not Found'})

def getProjects(request):
    projects = gsheets.get('Projects')
    questions = gsheets.get('Questions')
    responses = gsheets.get('Responses')
    grades = gsheets.get('Grades')

    questionDict = {}
    for response in responses:
        if response[1] not in questionDict:
            questionDict[response[1]] = {'responses':0,'grades':0}
        questionDict[response[1]]['responses'] += 1

    for grade in grades:
        questionDict[grade[2]]['grades'] += 1

    projectDict = {}
    for question in questions:
        if question[1] not in projectDict:
            projectDict[question[1]] = []
        projectDict[question[1]].append(questionDict[question[2]])

    projectList = []
    print (projectDict)
    for project in projects:
        totalResponses = 0
        totalGrades = 0
        for question in projectDict[str(project[0])]:
            totalResponses += question['responses']
            totalGrades += question['grades']

        projectList.append({'project':{'id':project[0],'name':project[2],'totalResponse':totalResponses, 'totalGrades':totalGrades}})
    return JsonResponse(projectList, safe=False)

def getQuestions(request, project_id):
    questions = gsheets.get('Questions')
    responses = gsheets.get('Responses')
    grades = gsheets.get('Grades')

    questionDict = {}
    for response in responses:
        if response[1] not in questionDict:
            questionDict[response[1]] = {'responses': 0, 'grades': 0}
        questionDict[response[1]]['responses'] += 1

    for grade in grades:
        questionDict[grade[2]]['grades'] += 1

    questionList = []
    print (questionDict)
    for question in questions:
        if question[1] == project_id:
            questionList.append({'question':{'id':question[0], 'project_id':question[1], 'name':question[2], 'question_text':question[3], 'options':question[4].split(','), 'totalResponse':questionDict[question[2]]['responses'], 'totalGrades':questionDict[question[2]]['grades']}})

    return JsonResponse(questionList, safe=False)

def getQuestion(request,question_id):
    questions = gsheets.get('Questions')
    responses = gsheets.get('Responses')
    grades = gsheets.get('Grades')

    question = questions[int(question_id)-1]

    questionDict = {'id': question[0], 'project_id': question[1], 'name': question[2],
                                      'question_text': question[3], 'options': question[4].split(',')}

    ungradedResponses = []
    gradedResponses = []

    studentsGraded = []
    for grade in grades:
        if grade[2] == question[2]:
            gradeDict = {'id':grade[0],'date':grade[1],'question_name':grade[2],'user_short_name':grade[3],'student_id':grade[4],'student_response':grade[5],'user_score':grade[6]}
            if len(grade) == 8:
                gradeDict['user_comment'] = grade[7]
            else:
                gradeDict['user_comment'] = ''
            gradedResponses.append({'response':None,'grade':gradeDict,'student_id':grade[4]})
            studentsGraded.append(grade[4])

    for response in responses:
        responseDict = {'id':response[0], 'question_name':response[1],'student_id':response[2],'student_response':response[3]}
        if response[1] == question[2]:
            if response[2] in studentsGraded:
                for gradedResponse in gradedResponses:
                    if gradedResponse['student_id'] == response[2]:
                        gradedResponse['response'] = responseDict
            else:
                ungradedResponses.append({'response':responseDict,'grade':None})

    allResponses = gradedResponses + ungradedResponses
    return JsonResponse({'question':questionDict,'responses':allResponses, 'currentIndex': len(gradedResponses)})

def submitGrade(request, question_id):
    student_id = request.POST['student_id']
    student_response = request.POST['student_response']
    user_id = request.POST['user_id']
    user_comment = request.POST['user_comment']
    user_score = request.POST['user_score']
    question_name = request.POST['question_name']
    now = datetime.datetime.now().strftime('%m/%d/%Y %H:%M:%S')

    #check to see if response already graded
    grades = gsheets.get('Grades')
    grade_id = None
    for grade in grades:
        if grade[2] == question_name and grade[4] == student_id and grade[3] == user_id:
            grade_id = grade[0]
            break

    if grade_id:
        gsheets.put('Grades',[now,question_name,user_id,student_id,student_response,user_score,user_comment], grade_id)
    else:
        gsheets.post('Grades', [now, question_name, user_id, student_id, student_response, user_score, user_comment])

    return JsonResponse({'success':True})






