from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse, JsonResponse, Http404, HttpResponseForbidden, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.apps import apps

from home.models import Page, Component, ComponentDataField, PageComponent, Model, Field
from user.views import my_login_required


import time
import requests
import csv

import json
import os

#from user.views import my_login_required

def Index(request, param = "", param2 = ""):
    if request.META['HTTP_HOST'] == "localhost:8000":
        #In development mode this connects to the live React Node server
        html = requests.get("http://localhost:3000").content
        html = html.decode().replace('src="/static/js/bundle.js"', 'src="http://localhost:3000/static/js/bundle.js"')
        return HttpResponse(html)

    return render(request, "index.html", {})

def Context(request):

    return JsonResponse({}, status=200)


def ListComponents(request):
    components = Component.objects.values("id", "name", "description")
    components = list(components)
    print (components)

    return JsonResponse({"components": components}, status=200)


def ManageComponent(request, id):
    if id == "0":
        component = Component()
        component.save()
        return JsonResponse({"redirect": "/component/%s/" % (component.id)})

    component = get_object_or_404(Component, pk = id)

    if request.method == "POST":
        component.name = request.POST.get('name', component.name)
        component.description = request.POST.get('description', component.description)
        component.html = request.POST.get('html', component.html)
        component.save()

    return JsonResponse({"component": component.dict()})


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




