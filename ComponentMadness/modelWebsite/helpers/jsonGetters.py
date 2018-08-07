from django.apps import apps

def getInstanceJson(appLabel, modelName, instance, related = []):
    #gets the model object, similiar to like Component of Component.objects.filter
    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', ''))
    fields = getModelFields(model)

    jsonInstance = dumpInstance(modelName, fields, instance, related)

    return [jsonInstance]

def getInstancesJson(appLabel, modelName, related = [], instanceQuery=None):
    # page for adding a new instance
    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', ''))
    fields = getModelFields(model)

    instances = []
    for instance in instanceQuery:
        jsonInstance = dumpInstance(modelName, fields, instance, related = related)
        if jsonInstance not in instances:
            instances.append(jsonInstance)

    return instances


def dumpInstance(modelName, fields, instance, related = []):
    jsonInstance = {}
    jsonInstance[modelName] = {}
    jsonInstance[modelName]['unicode'] = str(instance)

    for field in fields:
        if field[0] == 'password':
            continue

        newRelated = []
        for relation in related:
            search = field[0] + "__"
            if relation.startswith(search):
                newRelated.append(relation[len(search):])

        #print ("New Related : %s" % (newRelated))
        if field[1] in ['ForeignKey','ManyToManyField']:
            try:
                getattr(instance, field[0])
            except Exception as e:
                print (e)
                continue
            if type(getattr(instance, field[0])).__name__ in ['ManyRelatedManager',"RelatedManager"]:
                if field[0] not in related:
                    continue
                foreignKeyDict = getInstancesJson(field[2], field[3], instanceQuery=getattr(instance, field[0]).all(),
                                                  related = newRelated)
                jsonInstance[modelName][field[0]] = foreignKeyDict

            else:
                if field[0] not in related:
                    if field[1] == 'ForeignKey':
                        jsonInstance[modelName][field[0] + "_id"] = getattr(instance, field[0] + "_id")
                    else:
                        jsonInstance[modelName][field[0]] = getattr(instance, field[0])
                else:
                    if field[1] == 'ForeignKey':
                        foreignKeyDict = getInstanceJson(field[2], field[3], getattr(instance, field[0]), related = newRelated)[0]
                        jsonInstance[modelName][field[0]] = foreignKeyDict[field[3]]

        else:
            jsonInstance[modelName][field[0]] = getattr(instance, field[0])

    return jsonInstance


def getModelFields(model):
    #this gets all the fields for the model
    fields = []
    links = []

    instance = model()
    modelFields = model._meta.get_fields()

    for field in modelFields:

        if field.auto_created:

            if field.get_internal_type() != 'ForeignKey':
                continue

            fields.append([field.name, field.get_internal_type(), field.related_model._meta.app_label,
                field.related_model._meta.object_name.lower(), True])

        elif field.get_internal_type() not in ['ForeignKey', 'ManyToManyField']:
            fields.append([field.name, field.get_internal_type(), getattr(instance, field.name)])
        elif field.get_internal_type() in ['ForeignKey','ManyToManyField']:
            fields.append([field.name, field.get_internal_type(), field.related_model._meta.app_label,
                           field.related_model._meta.object_name.lower(), False])

    return fields
