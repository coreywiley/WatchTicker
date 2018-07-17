import json
from django.apps import apps
from modelWebsite.helpers.jsonGetters import getInstanceJson, getInstancesJson, getModelFields

def insert(appLabel, modelName, modelFields,requestFields, id = None, related=[]):
    print ('Here')
    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', ''))
    instance = model()
    if id:
        instance = model.objects.filter(id=id).first()

    for field in modelFields:
        if field.get_internal_type() == 'ManyToManyField' and field.name + '[]' in requestFields:
            pass
        elif field.name not in requestFields:
            continue
        if field.name == "id":
            continue

        if field.get_internal_type() == 'TextField' and field.name == "data":
            try:
                data = json.loads(requestFields[field.name])
                setattr(instance, field.name, data)
            except:
                print ("No Valid JSON data found!")
                continue

        elif field.get_internal_type() == 'BooleanField':
            print (field.name)
            if requestFields[field.name] in [False, 'False','false']:
                print ("Set To False")
                setattr(instance, field.name, False)
            else:
                print ("Set To True")
                setattr(instance, field.name, True)

        elif field.get_internal_type() not in ['ForeignKey', 'ManyToManyField']:
            setattr(instance, field.name, requestFields[field.name])

        elif field.get_internal_type() == 'ForeignKey':
            if requestFields[field.name] not in [None, 'None']:
                setattr(instance, field.name + '_id', requestFields[field.name])
            else:
                setattr(instance, field.name, None)

        elif field.get_internal_type() == 'ManyToManyField':
            items = json.loads(requestFields[field.name + '[]'])
            foreignModel = apps.get_model(app_label=appLabel, model_name=field.name)
            for item in items:
                foreignInstance = foreignModel.objects.filter(id=int(item)).first()
                print ("Check", item, foreignInstance)
                getattr(instance, field.name).add(foreignInstance)

    instance.save()
    instance = model.objects.filter(id=instance.id).first()
    print ("Instance ID", instance.id)

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
    instances = getInstanceJson(appLabel, modelName, instance, related=related)

    return instances