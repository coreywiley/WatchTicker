from django.shortcuts import render
from django.apps import apps
from django.db.models import Q
from django.http import HttpResponse, JsonResponse, Http404, HttpResponseForbidden, HttpResponseRedirect
import django
from django.conf import settings

from modelWebsite.helpers.jsonGetters import getInstanceJson, getInstancesJson, getModelFields
from user.permissions import staff_required
from django.views.decorators.csrf import csrf_exempt
from modelWebsite.helpers.databaseOps import insert
import datetime

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

import os
import csv
import io
import json
import sendgrid
from sendgrid.helpers.mail import *

def CSRFMiddlewareToken(request):
    # Gather context and send it to React
    csrfmiddlewaretoken = django.middleware.csrf.get_token(request)
    return JsonResponse({'csrfmiddlewaretoken':csrfmiddlewaretoken}, status=200)

@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def getApps(request):
    print (request.user)
    djangoApps = []
    for app in apps.get_app_configs():
        djangoApps.append({'app':{'name':app.name}})

    return JsonResponse(djangoApps, safe=False)

@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def getModels(request,appLabel):
    models = []

    for model in apps.get_models():
        if model._meta.app_label == appLabel:
            models.append({'model':{'name':model.__name__}})

    return JsonResponse(models, safe=False)

@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def getModelFieldsJson(request,appLabel,modelName):
    print ("App Label", appLabel, "Model Name", modelName)
    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', ''))
    modelFields = getModelFields(model)
    return JsonResponse(modelFields, safe=False)


@api_view(['GET', 'POST', 'PUT'])
@permission_classes((IsAuthenticated, ))
def getModelInstanceJson(request, appLabel, modelName, id=None):
    print ("Request : %s" % (request.GET))
    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', ''))

    parameters = request.GET.dict()
    related = []
    if 'related' in parameters:
        related = [x for x in parameters['related'].split(',') if x != ""]
        del parameters['related']

    order_by = []
    if 'order_by' in parameters:
        order_by = [x for x in parameters['order_by'].split(',') if x != ""]
        del parameters['order_by']

    only = []
    if 'only' in parameters:
        only = [x for x in parameters['only'].split(',') if x != ""]
        del parameters['only']

    values_list = []
    if 'values_list' in parameters:
        values_list = [x for x in parameters['values_list'].split(',') if x != ""]
        del parameters['values_list']

    limit = 0
    if 'limit' in parameters:
        limit = int(parameters['limit'])
        del parameters['limit']

    count = False
    if 'count' in parameters:
        count = True
        del parameters['count']

    print (values_list)
    print ("Parameters", parameters)
    print ("Only", only)

    excluded = {}
    orFilters = None
    newParameters = parameters.copy()
    print ('\n\n',parameters,'\n\n')
    for parameter in parameters:

        if ',' in parameters[parameter]:
            newParameters[parameter] = [x for x in parameters[parameter].split(',') if x != ""]
        if parameters[parameter] == 'true':
            newParameters[parameter] = True
        elif parameters[parameter] == 'false':
            newParameters[parameter] = False

        if parameter.startswith("exclude__"):
            excluded[parameter.replace("exclude__", "")] = parameters[parameter]
            del newParameters[parameter]
        elif parameter.startswith("or__"):
            if parameter.endswith("__splitme"):
                key = parameter.replace("or__", "").replace("__splitme", "")
                for value in parameters[parameter]:
                    orFilters = addOrFilter(orFilters, key, value)
            else:
                orFilters = addOrFilter(orFilters, parameter.replace("or__", ""), parameters[parameter])

            del newParameters[parameter]

    parameters = newParameters
    print ("Related : %s" % (related))

    # single instance
    if request.method == "GET":
        if id:
            #this is a catch for a variable in the url during testing. aka /getModelJson/components/{{request.id}}/
            if isinstance(id, str) and id.startswith("{{"):
                instance = model.objects.filter().first()
            else:
                instance = model.objects.filter(id=int(id)).prefetch_related(*related).first()

            instances = getInstanceJson(appLabel, modelName, instance, related=related)

        else:
            #gets instances queried by kwargs for a filtered list of the database
            instanceQuery = model.objects.filter(**parameters)
            if orFilters:
                instanceQuery = instanceQuery.filter(orFilters)

            instanceQuery = instanceQuery.exclude(**excluded).prefetch_related(*related).order_by(*order_by).only(*only)

            if len(values_list) > 1:
                instanceQuery = instanceQuery.values_list(*values_list)
            elif len(values_list) == 1:
                instanceQuery = instanceQuery.values_list(*values_list, flat=True)

            if limit > 0:
                instanceQuery = instanceQuery[:limit]

            if count:
                return JsonResponse({'count': instanceQuery.count()})


            if len(values_list) > 0:
                instancesData = []
                for instance in query:
                    instancesData.append(instance)
                instances = {}
                instances[modelName] = instancesData
            else:
                instances = getInstancesJson(appLabel, modelName, instanceQuery = instanceQuery, related=related, only=only)

    # edit or instance
    elif request.method in ['PUT', 'POST']:
        instances = createAndUpdateModel(request, appLabel, modelName, related, id)


    return JsonResponse(instances,safe=False)



def createAndUpdateModel(request, appLabel, modelName, related, id=None):
    # jsonData = json.loads(request.body)
    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', ''))

    modelFields = model._meta.get_fields()
    if request.method == 'PUT':
        requestFields = request.PUT
    else:
        requestFields = request.POST

    print ("POST Payload:", requestFields)

    if 'multiple' in requestFields:
        instances = []
        items = json.loads(requestFields[requestFields['multiple']])
        print ("Items", items)
        for item in items:
            newFields = item
            for key in requestFields.keys():
                newFields[key] = requestFields[key]
            instances.append(insert(appLabel, modelName, modelFields, newFields, id=id, related=related))
    elif 'csv_file' in request.FILES:
        try:
            print ("CSV FILE")
            instances = []
            csv_file = request.FILES["csv_file"]
            if not csv_file.name.endswith('.csv'):
                print ("ERROR")
            # if file is too large, return
            if csv_file.multiple_chunks():
                print ("ERROR")

            file_data = csv_file.read().decode("utf-8")
            lines = file_data.split("\n")
            # loop over the lines and save them in db. If error , store as string and then display
            i = 0
            titles = {}

            for line in lines:
                if i == 0:
                    i = 1
                    fields = line.split(",")
                    for x in range(len(fields)):
                        titles[x] = fields[x].strip()
                    continue

                fieldData = line.split(",")
                newFields = {}
                blankLine = True
                for x in range(len(fields)):
                    newFields[titles[x]] = fieldData[x].strip()
                    if newFields[titles[x]] != '':
                        blankLine = False
                if not blankLine:
                    print (newFields)
                    instances.append(insert(appLabel, modelName, modelFields, newFields, id=id, related=related))
        except Exception as e:
            print ("ERROR")
            instances = ['ERROR']
    else:
        print (1)
        instances = insert(appLabel, modelName, modelFields, requestFields, id=id, related=related)

    return instances



def addOrFilter(orFilters, key, value):
    if not orFilters:
        orFilters = Q(**{key.replace("or__", ""): value})
    else:
        orFilters.add(Q(**{key.replace("or__", ""): value}), Q.OR)

    return orFilters

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def deleteModelInstance(request,appLabel,modelName,id):
    print ('DELETING', appLabel, modelName, id)
    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_',''))
    model.objects.filter(id=id).delete()

    return JsonResponse({'success':True})



@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def writeComponents(request):
    filepath = os.path.join(os.getcwd(), "..", "reactapp", "src", "library")
    print (filepath)

    #components = Component.objects.exclude(name__in = ['Test', "Dynamic Importer Example"]).all()
    components = getFilesFromFolder(filepath)



    filepath = os.path.join(filepath, "index.js")
    importNames = "";
    with open(filepath, "w") as file:
        for f in components:
            folder = components[f]
            for key in folder:
                path = folder[key]
                if type(path) == dict:
                    for key2 in path:
                        file.write("import %s_ from '%s';\n" % (key2, path[key2]))
                else:
                    file.write("import %s_ from '%s';\n" % (key, path))

        for f in components:
            folder = components[f]
            for key in folder:
                if type(folder[key]) == dict:
                    for key2 in folder[key]:
                        file.write("export const %s = %s_;\n" % (key2, key2))
                        importNames += "%s, " % (key2)
                else:
                    file.write("export const %s = %s_;\n" % (key, key))
                    importNames += "%s, " % (key)
    importNames = importNames[:-2]

    """
    for component in components:
        filepath = os.path.join(path, "%s.js" % (component.name.lower()))
        with open(filepath, "w") as file:
            file.write("import React, { Component } from 'react';\n")
            file.write("import resolveVariables from '../base/resolver.js';\n")

            for requirement in component.componentRequirements.all():
                file.write(requirement.importStatement + '\n')

            file.write("\n")
            file.write(component.html)
            file.write("\n\nexport default %s;\n" % (component.name))
    """

    filepath = os.path.join(os.getcwd(), "..", "reactapp", "src")
    templatepath = os.path.join(filepath, "componentResolverTemplate.js")
    template = open(templatepath, "r").read()
    nameResolvers = ""
    idResolvers = ""
    for f in components:
        folder = components[f]
        for key in folder:
            path = folder[key]
            if type(path) == dict:
                for key2 in path:
                    nameResolvers += '    if (name == "%s"){return %s;}\n' % (key2, key2)
                    idResolvers += '    if (id == "%s"){return %s;}\n' % (key2, key2)
            else:
                nameResolvers += '    if (name == "%s"){return %s;}\n' % (key, key)
                idResolvers += '    if (id == "%s"){return %s;}\n' % (key, key)

    template = template.replace("{{IMPORTS}}", "{%s}" % (importNames))
    template = template.replace("{{NAMERESOLVERS}}", nameResolvers)
    template = template.replace("{{IDRESOLVERS}}", idResolvers)

    filepath = os.path.join(filepath, "componentResolver.js")
    with open(filepath, "w") as file:
        file.write(template)

    return HttpResponse("")

def writeModelPageTemplates(request):
    filepath = os.path.join(os.getcwd(), "..", "reactapp", "src", "pages", "modelEditAndView")
    editTemplatePath = os.path.join(filepath, "editTemplate.js")
    viewTemplatePath = os.path.join(filepath, "viewTemplate.js")
    models = apps.get_models()

    models = apps.get_models()
    djangoApps = []
    for app in apps.get_app_configs():
        appName = app.name

        for model in models:
            if model._meta.app_label == appName:
                modelName = model.__name__
                defaultDict = {}
                componentList = []
                formComponentList = []
                componentProps = {}
                formComponentProps = {}
                for field in model._meta.get_fields():
                    fieldName = field.name
                    fieldLabel = fieldName.title()
                    fieldType = field.get_internal_type()

                    try:
                        fieldDefault = field.get_default()
                    except:
                        fieldDefault = ''

                    if fieldType == 'ForeignKey':
                        relatedApp = field.related_model._meta.app_label
                        relatedModel = field.related_model._meta.object_name.lower()

                    if fieldDefault == True:
                        defaultDict[fieldName] = 'true'
                    elif fieldDefault == False:
                        defaultDict[fieldName] = 'false'
                    elif isinstance(fieldDefault, datetime.datetime):
                        defaultDict[fieldName] = fieldDefault.strftime('%m/%d/%Y')
                    elif fieldDefault != None:
                        defaultDict[fieldName] = fieldDefault
                    else:
                        defaultDict[fieldName] = ''

                    if fieldType == 'AutoField':
                        componentList.append("Paragraph")
                        componentProps[fieldName] = {'text': 'this.state.' + fieldName}
                        formComponentList.append("TextInput")
                        formComponentProps[fieldName] = {'name':fieldName, 'label':fieldLabel, 'placeholder': fieldName, 'value':''}

                    elif fieldType == 'CharField':
                        componentList.append("Paragraph")
                        componentProps[fieldName] = {'text': 'this.state.' + fieldName}
                        formComponentList.append("TextInput")
                        formComponentProps[fieldName] = {'name': fieldName, 'label': fieldLabel, 'placeholder': fieldName, 'value': ''}

                    elif fieldType == 'TextField':
                        componentList.append("MultiLineText")
                        componentProps[fieldName] = {'text': 'this.state.' + fieldName}
                        formComponentList.append("TextArea")
                        formComponentProps[fieldName] = {'name': fieldName, 'label': fieldLabel, 'placeholder': fieldName, 'value': ''}

                    elif fieldType in ['DecimalField','FloatField','IntegerField']:
                        componentList.append("Paragraph")
                        componentProps[fieldName] = {'text': 'this.state.' + fieldName}
                        formComponentList.append("NumberInput")
                        formComponentProps[fieldName] = {'name': fieldName, 'label': fieldLabel, 'placeholder': 0, 'value': 0}

                    elif fieldType == 'BooleanField':
                        componentList.append("Paragraph")
                        componentProps[fieldName] = {'text': 'this.state.' + fieldName}
                        formComponentList.append("Select")
                        formComponentProps[fieldName] = {'name': fieldName, 'label': fieldLabel, 'placeholder': 'Please Choose One', 'value': 'false', 'options': [['true','True'],['false','False']]}

                    elif fieldType == 'DateField':
                        componentList.append("Paragraph")
                        componentProps[fieldName] = {'text': 'this.state.' + fieldName}
                        formComponentList.append("TextInput")
                        formComponentProps[fieldName] = {'name': fieldName, 'label': fieldLabel, 'placeholder': '2020-10-24', 'value': '', 'display_time': 'false'}

                    elif fieldType == 'DateTimeField':
                        componentList.append("Paragraph")
                        componentProps[fieldName] = {'text': 'this.state.' + fieldName}
                        formComponentList.append("TextInput")
                        formComponentProps[fieldName] = {'name': fieldName, 'label': fieldLabel, 'placeholder': '2020-10-24 14:23:01', 'value': '', 'display_time': 'true'}

                    elif fieldType == 'ForeignKey':
                        componentList.append("Paragraph")
                        componentProps[fieldName] = {'text': 'this.state.' + fieldName}
                        formComponentList.append("Select")
                        formComponentProps[fieldName] = {'name': fieldName, 'label': fieldLabel,'placeholder': fieldName, 'value': '', 'optionsUrl': '/api/%s/%s/' % (relatedApp,relatedModel), 'optionsUrlMap':{'text':'{name}','value':'{id}'}}

                #turning lists and dicts into strings
                defaults = "{"
                for fieldName in defaultDict:
                    defaults += "'" + fieldName + "' : '" + defaultDict[fieldName] + "', "

                componentListString = "var componentList = ["
                formComponentListString = "var componentList = ["
                for i in range(len(componentList)):
                    if i != 0:
                        componentListString += ", "
                        formComponentListString += ", "

                    componentListString += componentList[i]
                    formComponentListString += formComponentList[i]

                componentListString += "];"
                formComponentListString += "];"

                componentPropsString = ''
                formComponentPropsString = ''
                i = 0
                listString = 'var ComponentProps = ['
                for fieldName in componentProps:
                    componentPropsString += 'var ' + fieldName + ' = ' + json.dumps(componentProps[fieldName]) + ';\n'
                    formComponentPropsString += 'var ' + fieldName + ' = ' + json.dumps(formComponentProps[fieldName]) + ';\n'
                    if i != 0:
                        listString += ", "
                    else:
                        i += 1
                    listString += fieldName

                componentPropsString += listString
                formComponentPropsString += listString

                editTemplate = open(editTemplatePath, "r").read()
                viewTemplate = open(viewTemplatePath, "r").read()

                editTemplate = editTemplate.replace("*App*", appName)
                editTemplate = editTemplate.replace("*Object*", modelName)
                editTemplate = editTemplate.replace("*CapitalObject*", modelName.title())
                editTemplate = editTemplate.replace("*Defaults*", defaults)
                editTemplate = editTemplate.replace("*ComponentProps*", componentPropsString)
                editTemplate = editTemplate.replace("*ComponentList*", componentListString)
                editTemplate = editTemplate.replace("*FormComponentList*", formComponentListString)
                editTemplate = editTemplate.replace("*FormComponentProps*", formComponentPropsString)

                viewTemplate = viewTemplate.replace("*App*", appName)
                viewTemplate = viewTemplate.replace("*Object*", modelName)
                viewTemplate = viewTemplate.replace("*CapitalObject*", modelName.title())
                viewTemplate = viewTemplate.replace("*Defaults*", defaults)
                viewTemplate = viewTemplate.replace("*ComponentProps*", componentPropsString)
                viewTemplate = viewTemplate.replace("*ComponentList*", componentListString)
                viewTemplate = viewTemplate.replace("*FormComponentList*", formComponentListString)
                viewTemplate = viewTemplate.replace("*FormComponentProps*", formComponentPropsString)

                newEditTemplate = os.path.join(filepath, "edit" + modelName + ".js")
                newViewTemplate = os.path.join(filepath, modelName + ".js")

                with open(newEditTemplate, "w") as file:
                    file.write(editTemplate)

                with open(newViewTemplate, "w") as file:
                    file.write(viewTemplate)


    return JsonResponse({'success':True})


def SendEmail(request):
    # using SendGrid's Python Library
    # https://github.com/sendgrid/sendgrid-python
    print (request)
    sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)
    from_email = Email(request.POST['from_email'])
    to_email = Email(request.POST['to_email'])
    subject = request.POST['subject']
    content = Content("text/html", request.POST['text'])

    mail = Mail(from_email, subject, to_email, content)
    response = sg.client.mail.send.post(request_body=mail.get())

    return JsonResponse({'status_code':str(response.status_code), 'body':str(response.body), 'headers':str(response.headers)})

def PhotoUpload(request):
    # get files
    name = ''
    if 'name' in request.POST:
        name = request.POST['name']

    uploaded_files = []
    print (request.FILES)
    print (request.FILES.getlist('files[]'))

    for i in range(len(request.FILES.getlist('files[]'))):
        file = request.FILES.getlist('files[]')[i]
        url = settings.MEDIA_URL + name + '_' + file.name
        print ("\n\n\n", settings.MEDIA_ROOT + name + '_' + file.name, "\n\n\n")
        with open(settings.MEDIA_ROOT + name + '_' + file.name, 'wb+') as saveFile:
            for chunk in file.chunks():
                saveFile.write(chunk)

        uploaded_files.append({'url': url, 'order': i, 'filename': name + '_' + file.name})
    #return url to file
    return JsonResponse({'uploaded_files':uploaded_files})