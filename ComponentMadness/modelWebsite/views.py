from django.shortcuts import render
from django.apps import apps
from django.http import HttpResponse, JsonResponse, Http404, HttpResponseForbidden, HttpResponseRedirect

from modelWebsite.helpers.jsonGetters import getInstanceJson, getInstancesJson, getModelFields
from user.views import staff_required
from django.views.decorators.csrf import csrf_exempt
from modelWebsite.helpers.databaseOps import insert

import os
import csv
import io
import json


def getApps(request):
    djangoApps = []
    for app in apps.get_app_configs():
        djangoApps.append({'app':{'name':app.name}})

    return JsonResponse(djangoApps, safe=False)

def getModels(request,appLabel):
    models = []

    for model in apps.get_models():
        if model._meta.app_label == appLabel:
            models.append({'model':{'name':model.__name__}})

    return JsonResponse(models, safe=False)

def getModelFieldsJson(request,appLabel,modelName):
    print ("App Label", appLabel, "Model Name", modelName)
    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', ''))
    modelFields = getModelFields(model)
    return JsonResponse(modelFields, safe=False)

def getModelInstanceJson(request, appLabel, modelName, id=None):
    print ("Request : %s" % (request.GET))
    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', ''))

    parameters = request.GET.dict()
    related = []
    if 'related' in parameters:
        related = parameters['related'].split(',')
        del parameters['related']

    order_by = []
    if 'order_by' in parameters:
        order_by = parameters['order_by'].split(',')
        del parameters['order_by']

    values_list = []
    if 'values_list' in parameters:
        values_list = parameters['values_list'].split(',')
        del parameters['values_list']

    amenities__has = []
    if 'amenities__has' in parameters:
        amenities__has = parameters['amenities__has'].split(',')
        del parameters['amenities__has']

    preferences__has = []
    if 'preferences__has' in parameters:
        preferences__has = parameters['preferences__has'].split(',')
        del parameters['preferences__has']

    print (values_list)
    print ("Parameters",parameters)

    for parameter in parameters:
        if ',' in parameters[parameter]:
            parameters[parameter] = parameters[parameter].split(',')
        if parameters[parameter] == 'true':
            parameters[parameter] = True
        elif parameters[parameter] == 'false':
            parameters[parameter] = False

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
        #page for adding a new instance
        elif not id:
            #gets instances queried by kwargs for a filtered list of the database
            if len(values_list) == 1:
                instancesData = []
                if len(values_list) > 1:
                    query = model.objects.filter(**parameters).values_list(*values_list).prefetch_related(*related).order_by(*order_by)
                else:
                    query = model.objects.filter(**parameters).values_list(*values_list,flat=True).prefetch_related(*related).order_by(*order_by)
                for instance in query:
                    instancesData.append(instance)
                instances = {}
                instances[modelName] = instancesData
            else:
                instanceQuery = model.objects.filter(**parameters).prefetch_related(*related).order_by(*order_by)
                if len(preferences__has) > 0:
                    print ('Preferences_Has')
                    for item in preferences__has:
                        instanceQuery = instanceQuery.filter(preferences=item)
                if len(amenities__has) > 0:
                    for item in amenities__has:
                        instanceQuery = instanceQuery.filter(amenities=item)

                instances = getInstancesJson(appLabel, modelName, instanceQuery = instanceQuery, related=related)

    # edit or instance
    if request.method in ['PUT', 'POST']:
        # jsonData = json.loads(request.body)
        model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', ''))

        modelFields = model._meta.get_fields()
        if request.method == 'PUT':
            requestFields = request.PUT
        else:
            requestFields = request.POST

        print ('Request Fields',requestFields)
        if 'multiple' in requestFields:
            instances = []
            items = json.loads(requestFields[requestFields['multiple']])
            print ("Items",items)
            for item in items:
                newFields = item
                for key in requestFields.keys():
                    newFields[key] = requestFields[key]
                instances.append(insert(appLabel, modelName, modelFields,newFields, id = id, related=related))
        else:
            print ('Not There!')
            instances = insert(appLabel, modelName, modelFields,requestFields, id = id, related=related)



    return JsonResponse(instances,safe=False)



def deleteModelInstance(request,appLabel,modelName,id):
    print ('DELETING', appLabel, modelName, id)
    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_',''))
    model.objects.filter(id=id).delete()

    return JsonResponse({'success':True})




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


import pprint

def getFilesFromFolder(folder):
    #Read a folder file system into python as a dictionary
    entries = {}

    for file in os.listdir(folder):
        #Avoid Word temp files
        if file.startswith("~"):
            continue

        if file == 'index.js':
            continue

        path = folder + "\\" + file
        if os.path.isfile(path):
            #Add file to dictionary with full path as the value
            key = file.replace('.js', '').capitalize()
            value = './%s' % (path.split('reactapp\\src\\library\\')[-1].replace('\\', '/'))

            entries[key] = value

        elif os.path.isdir(path):
            #Add a folder and recursivly search its children
            entries[file] = getFilesFromFolder(path)

    pp = pprint.PrettyPrinter()
    pp.pprint(entries)

    return entries
