import uuid
import os
import csv
import io
import json
import datetime
import sendgrid
from sendgrid.helpers.mail import *

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.shortcuts import render
from django.apps import apps
from django.db.models import Q
from django.http import HttpResponse, JsonResponse, Http404, HttpResponseForbidden, HttpResponseRedirect
import django
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404

from modelWebsite.helpers.jsonGetters import getInstanceJson, getInstancesJson, getModelFields
from user.permissions import staff_required
from modelWebsite.helpers.databaseOps import insert
from modelWebsite.models import ModelConfig, Page
import copy
import re
from modelWebsite.helpers.page_builder import componentTree, componentPrint

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
            models.append({'model': {'name': model.__name__}})

    return JsonResponse(models, safe=False)


@api_view(['GET'])
@permission_classes((AllowAny, ))
def modelPrint(request):
    content = ''

    content += "import uuid\n\n"
    content += "from django.db import models\n"
    content += "from django_extensions.db.fields import CreationDateTimeField\n"
    content += "from django.contrib.postgres.fields import JSONField\n"
    content += "from django.utils import timezone\n\n"
    content += "from user.models import User\n\n"
    content += ""
    content += "class CMModel(models.Model):\n"
    content += "    class Meta:\n"
    content += "        abstract = True\n"
    content += "    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)\n"
    content += "\n"
    content += "    GET_STAFF = False\n"
    content += "    POST_STAFF = False\n"
    content += "    DELETE_STAFF = False\n"
    content += "\n"
    content += "    created_at = models.DateTimeField(auto_now_add=True)\n"
    content += "    updated_at = models.DateTimeField(auto_now=True)\n"

    configs = ModelConfig.objects.all()
    for config in configs:
        content += "\nclass %s(CMModel):\n" % (config.name)

        try:
            data = json.loads(json.loads(config.data))
        except:
            data = json.loads(config.data)

        for field in data['fields']:
            if 'model' in field:
                continue
            print ("Field", field)
            blank = False
            if field['blank'] == 'True':
                blank = True

            if field['type'] == 'DateTime':
                field['default'] = 'timezone.now'
            else:
                field['default'] = "'%s'" % (field['default'])


            params = "blank=%s, default=%s" % (blank, field['default'])
            content += "    %s = models.%sField(%s)\n" % (field['name'], field['type'], params)

        for related in data['related']:
            params = ''
            content += "    %s = models.ForeignKey(%s, on_delete=models.CASCADE, related_name='%s')\n" % (
                related['name'], related['model'], params
            )

    content += '\n\n'

    f = open(settings.STATIC_ROOT + '../models.py', 'w+')
    f.write(content)
    f.close()

    return JsonResponse({'success':True})


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def getModelFieldsJson(request,appLabel,modelName):
    print ("App Label", appLabel, "Model Name", modelName)
    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', ''))
    modelFields = getModelFields(model)
    return JsonResponse(modelFields, safe=False)

def getModelInstanceJson(request, appLabel, modelName, id=None):
    print ("Request : %s" % (request.GET))
    model = apps.get_model(app_label=appLabel, model_name=modelName)

    parameters = request.GET.dict()

    #model security
    if request.method == "GET" and appLabel == 'user' and modelName == 'user' and model.GET_STAFF:
        parameters['id'] = request.user.id
    elif request.method == "POST" and model.POST_STAFF and appLabel == 'user' and modelName == 'user':
        parameters['id'] = request.user.id
    elif request.method == "GET" and model.GET_STAFF and not request.user.is_staff:
        user_field = None
        for field in model._meta.get_fields():
            if field.get_internal_type() == 'ForeignKey':
                if field.related_model._meta.app_label == 'user' and field.related_model._meta.object_name.lower() == 'user':
                    user_field = field.name
                    break

        if user_field:
            parameters[user_field] = request.user.id
        else:
            return JsonResponse({'error':'You are not authorized to view this.'})

    elif request.method == "POST" and model.POST_STAFF and not request.user.is_staff:
        user_field = None
        for field in model._meta.get_fields():
            if field.get_internal_type() == 'ForeignKey':
                if field.related_model._meta.app_label == 'user' and field.related_model._meta.object_name.lower() == 'user':
                    user_field = field.name
                    break

        if user_field:
            parameters[user_field] = request.user.id
        else:
            return JsonResponse({'error':'You are not authorized to view this.'})

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
        if isinstance(parameters[parameter], uuid.UUID):
            continue
        if parameters[parameter]:
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
    relatedClean = []
    for relate in related:
        relatedClean.append(relate.replace('__count',''))
    print ("Related : %s" % (related))

    # single instance
    if request.method == "GET":
        if id:
            #this is a catch for a variable in the url during testing. aka /getModelJson/components/{{request.id}}/
            if isinstance(id, str) and id.startswith("{{"):
                instance = model.objects.filter().first()
            else:
                instance = model.objects.filter(id=int(id)).prefetch_related(*relatedClean).first()

            instances = getInstanceJson(appLabel, modelName, instance, related=related)

        else:
            #gets instances queried by kwargs for a filtered list of the database
            instanceQuery = model.objects.filter(**parameters)
            if orFilters:
                instanceQuery = instanceQuery.filter(orFilters)

            instanceQuery = instanceQuery.exclude(**excluded).prefetch_related(*relatedClean).order_by(*order_by).only(*only)

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

@api_view(['POST', 'GET'])
@permission_classes((AllowAny, ))
def deleteModelInstance(request,appLabel,modelName,id):
    print ('DELETING', appLabel, modelName, id)

    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', ''))

    if appLabel == 'user' and modelName == 'user' and model.DELETE_STAFF:
        if id == request.user.id:
            model.objects.filter(id=id).delete()
        else:
            return JsonResponse({'error':'You are not authorized to delete this.'})
    elif model.DELETE_STAFF and not request.user.is_staff:
        user_field = None
        for field in model._meta.get_fields():
            if field.get_internal_type() == 'ForeignKey':
                if field.related_model._meta.app_label == 'user' and field.related_model._meta.object_name.lower() == 'user':
                    user_field = field.name
                    break

        if user_field:
            instance = model.objects.filter(id=id).first()
            if instance.__dict__[user_field] == request.user.id:
                model.objects.filter(id=id).delete()
        else:
            return JsonResponse({'error':'You are not authorized to delete this.'})
    else:
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
    listTemplatePath = os.path.join(filepath, "listTemplate.js")
    models = apps.get_models()

    models = apps.get_models()
    djangoApps = []
    for app in apps.get_app_configs():
        appName = app.name
        if appName != 'home':
            continue

        for model in models:
            if model._meta.app_label == appName:
                modelName = model.__name__
                print (modelName)

                componentListString = ""
                formComponentListString = "\t\t\t\tvar Components = ["
                componentPropsString = ''
                formComponentPropsString = ''
                defaults = "{"
                listString = '\t\t\tvar ComponentProps = ['
                i = 0
                for field in model._meta.get_fields():
                    fieldName = field.name.lower()
                    if fieldName == 'id' or field.auto_created:
                        continue

                    fieldLabel = fieldName.title()
                    fieldType = field.get_internal_type()

                    try:
                        fieldDefault = field.get_default()
                    except:
                        fieldDefault = ''

                    if fieldType in ['ForeignKey', 'ManyToManyField']:
                        relatedApp = field.related_model._meta.app_label
                        relatedModel = field.related_model._meta.object_name.lower()

                    #defaults
                    if fieldDefault == True:
                        fieldDefault = 'true'
                    elif fieldDefault == False:
                        fieldDefault = 'false'
                    elif isinstance(fieldDefault, datetime.datetime):
                        fieldDefault = fieldDefault.strftime('%m/%d/%Y')
                    elif isinstance(fieldDefault, dict):
                        fieldDefault = json.dumps(fieldDefault)
                    elif fieldDefault != None:
                        fieldDefault = fieldDefault
                    else:
                        fieldDefault = ''


                    #components and their props
                    if fieldType == 'AutoField':
                        componentListString += "\t\t\t\t\t\t<Paragraph {...ComponentProps[%s]} />\n" % (str(i))
                        componentPropsString += "\t\t\tvar %s = {'text': this.state.%s};\n" % (fieldName,fieldName)
                        formComponentListString += "TextInput"
                        formComponentPropsString += "\t\t\tvar %s = {'name': '%s', 'label': '%s', 'placeholder': '%s', 'value': ''};\n" % (fieldName, fieldName, fieldLabel, fieldLabel)

                    elif fieldType == 'CharField':
                        componentListString += "\t\t\t\t\t\t<Paragraph {...ComponentProps[%s]} />\n" % (str(i))
                        componentPropsString += "\t\t\tvar %s = {'text': this.state.%s};\n" % (fieldName, fieldName)
                        formComponentListString += "TextInput"
                        formComponentPropsString += "\t\t\tvar %s = {'name': '%s', 'label': '%s', 'placeholder': '%s', 'value': ''};\n" % (fieldName, fieldName, fieldLabel, fieldLabel)

                    elif fieldType == 'TextField':
                        componentListString += "\t\t\t\t\t\t<MultiLineText {...ComponentProps[%s]} />\n" % (str(i))
                        componentPropsString += "\t\t\tvar %s = {'text': this.state.%s};\n" % (fieldName, fieldName)
                        formComponentListString += "TextArea"
                        formComponentPropsString += "\t\t\tvar %s = {'name': '%s', 'label': '%s', 'placeholder': '%s', 'value': ''};\n" % (fieldName, fieldName, fieldLabel, fieldLabel)

                    elif fieldType in ['DecimalField','FloatField','IntegerField']:
                        componentListString += "\t\t\t\t\t\t<Paragraph {...ComponentProps[%s]} />\n" % (str(i))
                        componentPropsString += "\t\t\tvar %s = {'text': this.state.%s};\n" % (fieldName, fieldName)
                        formComponentListString += "NumberInput"
                        formComponentPropsString += "\t\t\tvar %s = {'name': '%s', 'label': '%s', 'placeholder': 0, 'value': 0};\n" % (fieldName, fieldName, fieldLabel)

                    elif fieldType == 'BooleanField':
                        componentListString += "\t\t\t\t\t\t<Paragraph {...ComponentProps[%s]} />\n" % (str(i))
                        componentPropsString += "\t\t\tvar %s = {'text': this.state.%s};\n" % (fieldName, fieldName)
                        formComponentListString += "Select"
                        formComponentPropsString += "\t\t\tvar %s = {'name': '%s', 'label': '%s', 'placeholder': '%s', 'value': false, 'options': [{'value':true,'text':'True'},{'value':false,'text':'False'}]};\n" % (fieldName, fieldName, fieldLabel, fieldLabel)

                    elif fieldType == 'DateField':
                        componentListString += "\t\t\t\t\t\t<Paragraph {...ComponentProps[%s]} />\n" % (str(i))
                        componentPropsString += "\t\t\tvar %s = {'text': this.state.%s};\n" % (fieldName, fieldName)
                        formComponentListString += "DateTimePicker"
                        formComponentPropsString += "\t\t\tvar %s = {'name': '%s', 'label': '%s', 'placeholder': '%s', 'value': false, 'display_time': false};\n" % (fieldName, fieldName, fieldLabel, fieldLabel)

                    elif fieldType == 'DateTimeField':
                        componentListString += "\t\t\t\t\t\t<Paragraph {...ComponentProps[%s]} />\n" % (str(i))
                        componentPropsString += "\t\t\tvar %s = {'text': this.state.%s};\n" % (fieldName, fieldName)
                        formComponentListString += "DateTimePicker"
                        formComponentPropsString += "\t\t\tvar %s = {'name': '%s', 'label': '%s', 'placeholder': '%s', 'value': false, 'display_time': true};\n" % (fieldName, fieldName, fieldLabel, fieldLabel)

                    elif fieldType == 'ForeignKey':
                        componentListString += "\t\t\t\t\t\t<Paragraph {...ComponentProps[%s]} />\n" % (str(i))
                        componentPropsString += "\t\t\tvar %s = {'text': this.state.%s};\n" % (fieldName, fieldName)
                        formComponentListString += "Select"
                        formComponentPropsString += "\t\t\tvar %s = {'name': '%s', 'label': '%s', 'placeholder': '%s', 'value': '', 'optionsUrl': '/api/%s/%s/', 'optionsUrlMap': {'text':'{%s.unicode}','value':'{%s.id}'}};\n" % (fieldName, fieldName, fieldLabel, fieldLabel, relatedApp,relatedModel, relatedModel, relatedModel)

                    elif fieldType == 'ManyToManyField':
                        componentListString += "\t\t\t\t\t\t<Paragraph {...ComponentProps[%s]} />\n" % (str(i))
                        componentPropsString += "\t\t\tvar %s = {'text': this.state.%s};\n" % (fieldName, fieldName)
                        formComponentListString += "Select"
                        formComponentPropsString += "\t\t\tvar %s = {'name': '%s', 'label': '%s', 'placeholder': '%s', 'value': '', 'optionsUrl': '/api/%s/%s/', 'optionsUrlMap': {'text':'{%s.unicode}','value':'{%s.id}'}, 'multiple':true};\n" % (fieldName, fieldName, fieldLabel, fieldLabel, relatedApp,relatedModel, relatedModel, relatedModel)


                    formComponentListString += ", "
                    if i != 0:
                        listString += ", "
                        defaults += ", '%s' : '%s'" % (fieldName, str(fieldDefault))
                    else:
                        defaults += "'%s' : '%s'" % (fieldName, str(fieldDefault))

                    i += 1
                    listString += fieldName

                defaults += "}"
                listString += "];"

                formComponentListString += "];"

                componentPropsString += listString
                formComponentPropsString += listString

                editTemplate = open(editTemplatePath, "r").read()
                viewTemplate = open(viewTemplatePath, "r").read()
                listTemplate = open(listTemplatePath, "r").read()

                editTemplate = editTemplate.replace("*App*", appName)
                editTemplate = editTemplate.replace("*Object*", modelName.lower())
                editTemplate = editTemplate.replace("*CapitalObject*", modelName.title())
                editTemplate = editTemplate.replace("*Defaults*", defaults)
                editTemplate = editTemplate.replace("*ComponentProps*", componentPropsString)
                editTemplate = editTemplate.replace("*ComponentList*", componentListString)
                editTemplate = editTemplate.replace("*FormComponentList*", formComponentListString)
                editTemplate = editTemplate.replace("*FormComponentProps*", formComponentPropsString)

                viewTemplate = viewTemplate.replace("*App*", appName)
                viewTemplate = viewTemplate.replace("*Object*", modelName.lower())
                viewTemplate = viewTemplate.replace("*CapitalObject*", modelName.title())
                viewTemplate = viewTemplate.replace("*Defaults*", defaults)
                viewTemplate = viewTemplate.replace("*ComponentProps*", componentPropsString)
                viewTemplate = viewTemplate.replace("*ComponentList*", componentListString)
                viewTemplate = viewTemplate.replace("*FormComponentList*", formComponentListString)
                viewTemplate = viewTemplate.replace("*FormComponentProps*", formComponentPropsString)

                listTemplate = listTemplate.replace("*App*", appName)
                listTemplate = listTemplate.replace("*Object*", modelName.lower())
                listTemplate = listTemplate.replace("*CapitalObject*", modelName.title())

                newEditTemplate = os.path.join(filepath, "edit" + modelName + ".js")
                newViewTemplate = os.path.join(filepath, modelName + ".js")
                newListTemplate = os.path.join(filepath, "list" + modelName + ".js")

                with open(newEditTemplate, "w") as file:
                    file.write(editTemplate)

                with open(newViewTemplate, "w") as file:
                    file.write(viewTemplate)

                with open(newListTemplate, "w") as file:
                    file.write(listTemplate)



    return JsonResponse({'success':True})


def writePage(request, page_id):
    filepath = os.path.join(os.getcwd(), "..", "reactapp", "src", "pages", "modelEditAndView")
    viewTemplatePath = os.path.join(filepath, "viewTemplate.js")

    page = Page.objects.filter(id=page_id).first()
    componentPropsString = "\t\t\tvar ComponentProps=" + page.componentProps + ";"
    componentListString = ""

    page_components = json.loads(page.components)
    i = 0
    print (page_components)
    for component in page_components:
        componentListString += "\t\t\t\t\t<%s {...ComponentProps[%s] />\n" % (component, i)
        i += 1

    viewTemplate = open(viewTemplatePath, "r").read()

    viewTemplate = viewTemplate.replace("*App*", "modelWebsite")
    viewTemplate = viewTemplate.replace("*Object*", "page")
    viewTemplate = viewTemplate.replace("*CapitalObject*", "Page")
    viewTemplate = viewTemplate.replace("*Defaults*", "{}")
    viewTemplate = viewTemplate.replace("*ComponentProps*", componentPropsString)
    viewTemplate = viewTemplate.replace("*ComponentList*", componentListString)

    newViewTemplate = os.path.join(filepath, "page" + ".js")



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

def exportProjectComponent(request):
    filepath = os.path.join(os.getcwd(), "..", "reactapp", "src", "pages", "page_builder")
    dictTemplatePath = os.path.join(filepath, "componentDictTemplate.js")

    library_imports = ["FormWithChildren", "LogInForm", "SignUpForm", "ListWithChildren", "Div", "If", "Break", "NumberInput",
        "BooleanInput", "TextInput", "Select", "TextArea", "FileInput", "Button", "Header", "Paragraph", "CSSInput",
        "Container", "EmptyModal", "PasswordInput", "Json_Input", "Function_Input", "PasswordResetRequest",
        "CardWithChildren", "Icons"]
    project_library_imports = []
    all_imports = copy.deepcopy(library_imports)

    project_components = Page.objects.filter(pagegroup='0294d7d0-f9cf-457c-83d7-4632682934da')
    for component in project_components:
        capital_name = component.name.replace(' ', '')

        all_imports.append(capital_name)
        project_library_imports.append("import %s from 'projectLibrary/%s.js';" % (capital_name, capital_name))

        component_library_imports = ['TextInput']
        form_components = []
        search = re.compile('{props.[^}]*}')

        component_list = json.loads(component.components)
        for item in component_list:
            if item['type'] not in component_library_imports:
                component_library_imports.append(item['type'])
            for key in item['props']:
                print (type(item['props'][key]))
                required_props = search.findall(str(item['props'][key]))
                print ("Required Props", required_props, "\n")
                if len(required_props) > 0:
                    for prop in required_props:
                        prop_name = prop.replace('{props.', '')
                        prop_name = prop_name.replace('}', '')
                        form_components.append("<TextInput name={'%s'} label={'%s'} />" % (prop_name, prop_name))

        component_tree = componentTree(component_list, None)
        components = componentPrint(component_tree, 2)
        can_have_children = 'false'

        component_filepath = os.path.join(os.getcwd(), "..", "reactapp", "src", "projectLibrary")
        projectTemplatePath = os.path.join(component_filepath, "template.js")
        projectTemplate = open(projectTemplatePath, "r").read()
        projectTemplate = projectTemplate.replace("*component_library_imports*", ', '.join(component_library_imports))
        projectTemplate = projectTemplate.replace("*CapitalName*", capital_name)
        projectTemplate = projectTemplate.replace("*form_components*", ',\n'.join(form_components))
        projectTemplate = projectTemplate.replace("*can_have_children*", can_have_children)
        projectTemplate = projectTemplate.replace("*components*", '\n'.join(components))

        newComponentTemplate = os.path.join(component_filepath, "%s.js" % (capital_name))
        with open(newComponentTemplate, "w") as file:
            file.write(projectTemplate)

    dictTemplate = open(dictTemplatePath, "r").read()
    dictTemplate = dictTemplate.replace("*library_imports*", ', '.join(library_imports))
    dictTemplate = dictTemplate.replace("*project_library_imports*", '\n'.join(project_library_imports))
    dictTemplate = dictTemplate.replace("*all_imports*", ', '.join(all_imports))

    newDictTemplate = os.path.join(filepath, "testDict.js")

    with open(newDictTemplate, "w") as file:
        file.write(dictTemplate)


    return JsonResponse({'success':True})