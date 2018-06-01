from django.shortcuts import render
from django.apps import apps
from django.http import HttpResponse, JsonResponse, Http404, HttpResponseForbidden, HttpResponseRedirect

from modelWebsite.helpers.jsonGetters import getInstanceJson, getInstancesJson
from user.views import staff_required
from django.views.decorators.csrf import csrf_exempt

from home.models import Component

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
        appModels[model._meta.app_label].append(model._meta.verbose_name)

    return JsonResponse({'apps': appModels})


def getModelInstanceJson(request,appLabel,modelName,id=None):
    print ("Request : %s" % (request.GET))

    parameters = request.GET.dict()
    related = []
    if 'related' in parameters:
        related = parameters['related'].split(',')
        del parameters['related']
    print ("Related : %s" % (related))

    # single instance
    if request.method == "GET":
        if id:
            instances = getInstanceJson(appLabel, modelName, id, related=related)
        #page for adding a new instance
        elif not id:
            instances = getInstancesJson(appLabel, modelName, parameters, related=related)

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

        print ("Related : %s" % (related))
        instances = getInstanceJson(appLabel, modelName, instance.id, related=related)

    return JsonResponse(instances,safe=False)



def deleteModelInstance(request,appLabel,modelName,id):
    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_',''))
    model.objects.filter(id=id).delete()
    return JsonResponse({'success':True})


def writeComponents(request):
    path = os.path.join(os.getcwd(), "..", "reactapp", "src", "library")
    print (path)

    components = Component.objects.exclude(name__in = ['Test', "Dynamic Importer Example"]).all()

    filepath = os.path.join(path, "index.js")
    importNames = "";
    with open(filepath, "w") as file:
        for component in components:
            file.write("import %s_ from './%s.js';\n" % (component.name, component.name.lower()))
        for component in components:
            file.write("export const %s = %s_;\n" % (component.name, component.name))
            importNames += "%s, " % (component.name)
    importNames = importNames[:-2]

    for component in components:
        filepath = os.path.join(path, "%s.js" % (component.name.lower()))
        with open(filepath, "w") as file:
            file.write("import React, { Component } from 'react';\n\n")
            file.write(component.html)
            file.write("\n\nexport default %s;\n" % (component.name))

    path = os.path.join(os.getcwd(), "..", "reactapp", "src")
    filepath = os.path.join(path, "compiler.js")
    importString = "import {%s} from './library';\n\n" % (importNames)
    with open(filepath, "w") as file:
        file.write("import React, { Component } from 'react';\n")
        file.write(importString)
        start = """
class Compiler extends Component {
    render() {
        var content = [];
        var page = this.props.page;
        for (var i=0; i<page.pageComponents.length; i++){
            var pageComponent = page.pageComponents[i].pagecomponent;
"""
        file.write(start)

        for component in components:
            middle = """
            if (pageComponent.component_id == "%s"){
                content.push(
                    <%s {...pageComponent.data} />
                );
            }
""" % (component.id, component.name)

            file.write(middle)

        end = """
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}

export default Compiler;"""

        file.write(end)

    return HttpResponse("")

