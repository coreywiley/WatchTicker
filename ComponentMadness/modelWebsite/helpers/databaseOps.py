import json
from django.apps import apps
from modelWebsite.helpers.jsonGetters import getInstanceJson, getInstancesJson, getModelFields

def insert(appLabel, modelName, modelFields,requestFields, id = None, related=[]):
    print ('::databaseOps:insert')

    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', ''))
    instance = model()
    if id:
        instance = model.objects.filter(id=id).first()

    for field in modelFields:
        if field.get_internal_type() == 'ManyToManyField' and field.name + '[]' in requestFields:
            continue
        elif field.get_internal_type() == 'ManyToManyField' and (field.name + '[]__remove' in requestFields or field.name + '__clear' in requestFields):
            pass
        elif field.name not in requestFields:
            continue
        if field.name in ["id","password"]:
            continue

        if field.get_internal_type() == 'TextField' and field.name == "data":
            try:
                data = json.loads(requestFields[field.name])
                setattr(instance, field.name, data)
            except:
                print ("No Valid JSON data found!")
                continue
        if field.get_internal_type() == 'JsonField':
            try:
                data = json.loads(requestFields[field.name])
                print ("\n\n\n\n", "JsonField", "\n",field.name, "\n",requestFields[field.name], "\n",data, "\n\n\n\n")
                setattr(instance, field.name, data)
            except:
                print ("No Valid JSON data found!")
                continue
        elif field.get_internal_type() in ['DateTimeField', 'DateField']:
            if requestFields[field.name] == '':
                setattr(instance, field.name, None)
            else:
                setattr(instance, field.name, requestFields[field.name])
        elif field.get_internal_type() == 'BooleanField':
            print (field.name)
            if requestFields[field.name] in [False, 'False','false']:
                print ("Set To False")
                setattr(instance, field.name, False)
            else:
                print ("Set To True")
                setattr(instance, field.name, True)

        elif field.get_internal_type() not in ['ForeignKey', 'ManyToManyField']:
            if field.get_internal_type() == 'DateTimeField' and requestFields[field.name] == '':
                continue
            if field.name in ['email']:
                setattr(instance, field.name, requestFields[field.name].lower())
            else:
                setattr(instance, field.name, requestFields[field.name])

        elif field.get_internal_type() == 'ForeignKey':
            if requestFields[field.name] not in [None, 'None']:
                setattr(instance, field.name + '_id', requestFields[field.name])
            else:
                setattr(instance, field.name, None)

        elif field.get_internal_type() == 'ManyToManyField':
            add = True
            if field.name + '[]' in requestFields:
                items = json.loads(requestFields[field.name + '[]'])
            elif field.name + '[]__remove' in requestFields:
                items = json.loads(requestFields[field.name + '[]__remove'])
                add = False

            foreignModel = apps.get_model(app_label=field.related_model._meta.app_label, model_name=field.related_model._meta.object_name)

            if field.name + '__clear' in requestFields:
                print ('clear!')
                getattr(instance, field.name).clear()

            for item in items:
                foreignInstance = foreignModel.objects.filter(id=int(item)).first()
                if add:
                    getattr(instance, field.name).add(foreignInstance)
                else:
                    getattr(instance, field.name).remove(foreignInstance)

    if 'password' in requestFields and requestFields['password'] != '':
        instance.set_password(requestFields['password'])

    instance.save()
    instance = model.objects.filter(id=instance.id).first()

    #This section needs __remove and __clear included
    for field in modelFields:
        print ("Found M2M Field:", field)

        if field.get_internal_type() == 'ManyToManyField' and field.name + "[]" in requestFields:
            print ('Woohoo!')
            #getattr(instance, field.name).clear()
            print(field.name, requestFields[field.name+'[]'])
            items = json.loads(requestFields[field.name + '[]'])
            print (items)
            foreignKeyIds = [int(id) for id in items]
            print (foreignKeyIds)
            getattr(instance, field.name).add(
                *list(field.related_model.objects.filter(id__in=foreignKeyIds)))

    print ("Related : %s" % (related))
    instances = getInstanceJson(appLabel, modelName, instance, related=related)

    return instances