from django.shortcuts import render
from django.apps import apps
from django.http import HttpResponse, JsonResponse, Http404, HttpResponseForbidden, HttpResponseRedirect

from modelWebsite.helpers.jsonGetters import getInstanceJson, getInstancesJson
from user.views import staff_required
from django.views.decorators.csrf import csrf_exempt

import os
import csv
import io
import json


def getModels(request):
    modelNames = []
    filter = None
    if 'apps' in request.GET:
        filter = request.GET['apps'].split(',')
    appModels = {}
    for model in apps.get_models():
        if filter and model._meta.app_label not in filter:
            continue
        if model._meta.app_label not in appModels:
            appModels[model._meta.app_label] = []

        appModels[model._meta.app_label].append([model._meta.verbose_name.replace(' ','_'), model._meta.app_label])
        modelNames.append([model._meta.verbose_name.replace(' ','_'), model._meta.app_label])
    return render(request,"getModels.html",{'appModels':appModels, 'modelNames':modelNames})


def getModelValues(request,appLabel, modelName,offset):
    offset = int(offset)
    instanceQuery = apps.get_model(app_label=appLabel, model_name=modelName.replace('_','')).objects.all()[offset:offset+100]

    instances = []
    for instance in instanceQuery:
        instances.append([instance.id,str(instance)])

    forwardButton = False
    if len(instances) == 100:
        forwardButton = True

    return render(request, "modelValues.html", {'instances': instances, 'modelName': modelName.replace(' ','_'), 'appLabel':appLabel,
                                                'backOffset': offset - 100, 'forwardOffset': offset+100,'forwardButton': forwardButton})



def getModelInstanceJson(request,appLabel,modelName,id=None):
    query_split = [x.split('=') for x in request.META['QUERY_STRING'].split('&')]

    parameters = {}

    if query_split[0][0] != '':
        for param in query_split:
            if 'id' in param[0]:
                parameters[param[0]+'_id'] = int(param[1])
            else:
                parameters[param[0]] = param[1]
    print ("PARAMETERS")
    print (parameters)
    # single instance
    if request.method == "GET" and id:
        instances = getInstanceJson(appLabel, modelName, id)

    #page for adding a new instance
    if request.method == "GET" and not id:
        instances = getInstancesJson(appLabel, modelName, parameters)

    # edit or instance
    if request.method in ['PUT', 'POST']:
        # jsonData = json.loads(request.body)
        model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', ''))

        instance = model()
        if id:
            instance = model.objects.filter(id=id).first()

        modelFields = model._meta.get_fields()
        if request.method == 'PUT':
            requestFields = request.PUT
        else:
            requestFields = request.POST

        for field in modelFields:
            if field.name not in requestFields:
                continue
            if field.name == "id":
                continue

            print ("%s : %s : %s" % (field.get_internal_type(), field.name, requestFields[field.name]))

            if field.get_internal_type() == 'TextField' and field.name == "data":
                try:
                    data = json.loads(requestFields[field.name])
                    setattr(instance, field.name, data)
                except:
                    print ("No Valid JSON data found!")
                    continue

            elif field.get_internal_type() == 'BooleanField':
                if requestFields[field.name] in [False, 'False']:
                    setattr(instance, field.name, False)
                else:
                    setattr(instance, field.name, True)

            elif field.get_internal_type() not in ['ForeignKey', 'ManyToManyField']:
                setattr(instance, field.name, requestFields[field.name])

            elif field.get_internal_type() == 'ForeignKey':
                if requestFields[field.name] not in [None, 'None']:
                    setattr(instance, field.name + '_id', requestFields[field.name])
                else:
                    setattr(instance, field.name, None)

        instance.save()

        for field in modelFields:
            if field.name not in requestFields:
                continue

            if field.name == 'password':
                if requestFields['password'] != '':
                    instance.set_password(requestFields['password'])

            elif field.get_internal_type() == 'ManyToManyField' and field.name + "[]" in requestFields:
                for foreignObject in getattr(instance, field.name).all():
                    getattr(instance, field.name).remove(foreignObject.id)
                print(field.name)
                foreignKeyIds = [int(id) for id in requestFields.getlist(field.name + "[]")]
                print (foreignKeyIds)
                getattr(instance, field.name).add(
                    *list(field.related_model.objects.filter(id__in=foreignKeyIds)))

        instances = getInstanceJson(appLabel,modelName, instance.id)

    return JsonResponse(instances,safe=False)



def deleteModelInstance(request,appLabel,modelName,id):
    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_',''))
    model.objects.filter(id=id).delete()
    return HttpResponseRedirect(request.GET['redirectLocation'])

@csrf_exempt
def getModelInstance(request, appLabel, modelName, id=None):
    # single instance
    if request.method == "GET" and id:
        model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_',''))

        instance = model.objects.filter(id=id).first()

        modelFields = model._meta.get_fields()
        fields = []
        links = []

        for field in modelFields:
            print (field.name)
            if field.auto_created:
                if field.get_internal_type() == 'ForeignKey':
                    currentRelated = [object for object in getattr(instance, field.related_name).all()]
                    links.append([field.name, field.get_internal_type(), currentRelated, None])
                continue
            if field.get_internal_type() not in ['ForeignKey','ManyToManyField']:
                fields.append([field.name,field.get_internal_type(), getattr(instance,field.name)])
            elif field.get_internal_type() == 'ForeignKey':
                foreignKeyObjectsQuery = field.related_model.objects.all()
                foreignKeyObjects = [[object.id,str(object)] for object in foreignKeyObjectsQuery]
                fields.append([field.name,field.get_internal_type(), str(getattr(instance,field.name)), foreignKeyObjects])
            elif field.get_internal_type() == 'ManyToManyField':
                foreignKeyObjectsQuery = field.related_model.objects.all()
                foreignKeyObjects = [[object.id, str(object)] for object in foreignKeyObjectsQuery]

                currentRelatedQuery = getattr(instance,field.name).all()
                currentRelated = [object.id for object in currentRelatedQuery]
                fields.append([field.name, field.get_internal_type(), currentRelated, foreignKeyObjects])

        return render(request, "modelInstance.html", {'links':links,'instance': instance, 'modelName': modelName.replace(' ','_'),'fields':fields, 'appLabel':appLabel})

    #page for adding a new instance
    if request.method == "GET" and not id:
        model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_',''))
        instance = None

        modelFields = model._meta.get_fields()
        fields = []

        for field in modelFields:
            if field.auto_created:
                continue
            if field.get_internal_type() not in ['ForeignKey','ManyToManyField']:
                fields.append([field.name,field.get_internal_type(), ""])
            elif field.get_internal_type() == 'ForeignKey':
                foreignKeyObjectsQuery = field.related_model.objects.all()
                foreignKeyObjects = [[object.id,str(object)] for object in foreignKeyObjectsQuery]
                fields.append([field.name,field.get_internal_type(), "", foreignKeyObjects])
            elif field.get_internal_type() == 'ManyToManyField':
                foreignKeyObjectsQuery = field.related_model.objects.all()
                foreignKeyObjects = [[object.id, str(object)] for object in foreignKeyObjectsQuery]
                currentRelated = []
                fields.append([field.name, field.get_internal_type(), currentRelated, foreignKeyObjects])

        return render(request, "modelInstance.html", {'links':None,'instance': instance, 'modelName': modelName.replace(' ','_'),'fields':fields, 'appLabel':appLabel})

    # delete instance
    if request.method == "DELETE":
        model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_',''))
        model.objects.filter(id=id).delete()
        return JsonResponse({'success':True})

    #edit or instance
    if request.method in ['PUT', 'POST']:
        if id:
            #jsonData = json.loads(request.body)
            model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_',''))
            instance = model.objects.filter(id=id).first()
            modelFields = model._meta.get_fields()
            if request.method == 'PUT':
                requestFields = request.PUT
            else:
                requestFields = request.POST

            for field in modelFields:
                if field.name == 'password':
                    if requestFields['password'] != '':
                        instance.set_password(requestFields['password'])
                elif field.get_internal_type() == 'BooleanField':
                    if requestFields[field.name] in [False,'False']:
                        setattr(instance, field.name, False)
                    else:
                        setattr(instance, field.name, True)
                elif field.get_internal_type() == 'ManyToManyField':
                    if field.name + "[]" in requestFields:
                        for foreignObject in getattr(instance, field.name).all():
                            getattr(instance, field.name).remove(foreignObject.id)
                        print(field.name)
                        foreignKeyIds = [int(id) for id in requestFields.getlist(field.name + "[]")]
                        print (foreignKeyIds)
                        getattr(instance, field.name).add(*list(field.related_model.objects.filter(id__in=foreignKeyIds)))
                elif field.name in requestFields:
                    if field.get_internal_type() not in ['ForeignKey', 'ManyToManyField']:
                        setattr(instance, field.name, requestFields[field.name])
                    elif field.get_internal_type() == 'ForeignKey':
                        if requestFields[field.name] not in [None,'None']:
                            setattr(instance, field.name + '_id', requestFields[field.name])
                        else:
                            setattr(instance, field.name, None)


            instance.save()

        else:
            if 'csv_file' in request.FILES:
                model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_',''))
                csv_file = request.FILES["csv_file"]
                if not csv_file.name.endswith('.csv'):
                    print("ERROR")
                # if file is too large, return
                if csv_file.multiple_chunks():
                    print("ERROR")

                readable_csv = csv_file.read().decode('utf-8').splitlines()
                print (readable_csv)
                # loop over the lines and save them in db. If error , store as string and then display
                firstLine = True
                columnToField = {}
                delimitedCSV = csv.reader(readable_csv,delimiter=",")
                for fields in delimitedCSV:

                    if firstLine:
                        for x in range(len(fields)):
                            columnToField[x] = str(fields[x]).strip()
                        firstLine = False
                        continue

                    modelFields = {}
                    for field in model._meta.get_fields():
                        modelFields[field.name] = field

                    newInstanceDict = {}
                    for x in range(len(fields)):
                        if columnToField[x] in modelFields:
                            if modelFields[columnToField[x]].get_internal_type() == 'ForeignKey':
                                newInstanceDict[columnToField[x]] = modelFields[columnToField[x]].related_model.objects.filter(name=str(fields[x]).strip()).first()
                            elif modelFields[columnToField[x]].get_internal_type() != "ManyToManyField":
                                newInstanceDict[columnToField[x]] = str(fields[x]).strip()

                    if newInstanceDict != {}:
                        instance = model(**newInstanceDict)
                        instance.save()

                        for x in range(len(fields)):
                            if columnToField[x] in modelFields:
                                if modelFields[columnToField[x]].get_internal_type() == 'ManyToManyField':
                                    foreignKeyNames = str(fields[x]).strip().split(';')
                                    getattr(instance, modelFields[columnToField[x]].name).add(*list(modelFields[columnToField[x]].related_model.objects.filter(name__in=foreignKeyNames)))

                return HttpResponseRedirect('/models/getModelValues/' + appLabel + '/' + modelName.replace(' ','_') + '/0/')

            #jsonData = json.loads(request.body)
            model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_',''))
            modelFields = model._meta.get_fields()
            if request.method == 'PUT':
                requestFields = request.PUT
            else:
                requestFields = request.POST

            fieldValueDict = {}

            for field in modelFields:
                print (field.name)
                if field.name in requestFields:
                    if field.get_internal_type() == 'BooleanField':
                        if requestFields[field.name] in [False, 'False']:
                            fieldValueDict[field.name] = False
                        else:
                            fieldValueDict[field.name] = True
                    elif field.get_internal_type() not in ['ForeignKey', 'ManyToManyField']:
                        fieldValueDict[field.name] = requestFields[field.name]
                    elif field.get_internal_type() == 'ForeignKey':
                        if requestFields[field.name] not in [None,'None']:
                            fieldValueDict[field.name + '_id'] = requestFields[field.name]
                        else:
                            fieldValueDict[field.name] = None
            print ("Field Value Dict")
            print (fieldValueDict)
            instance = model(**fieldValueDict)

            instance.save()

            for field in modelFields:
                if field.get_internal_type() == 'ManyToManyField':
                    if field.name + "[]" in requestFields:
                        ids = [int(id) for id in requestFields.getlist(field.name + "[]")]
                        getattr(instance, field.name).add(*list(field.related_model.objects.filter(id__in=ids).all()))

        if 'redirectLocation' in requestFields:
            return HttpResponseRedirect(requestFields['redirectLocation'])
        
        if 'addAnother' in requestFields:
            return HttpResponseRedirect('/models/modelInstance/' + appLabel + '/' + modelName.replace(' ', '_') + '/')
        else:
            return HttpResponseRedirect('/models/modelInstance/' + appLabel + '/' + modelName.replace(' ','_') + '/' + str(instance.id) + '/')


def writeComponents(request):
    path = os.path.join(os.getcwd(), "..", "reactapp", "src", "library")
    print (path)

    filepath = os.path.join(path, "test.js")
    with open(filepath, "wb") as file:
        file.write("I am a test component".encode())

    return HttpResponse("")

