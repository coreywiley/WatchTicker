from django.apps import apps

def getInstanceJson(appLabel,modelName,id):
    #gets the model object, similiar to like Component of Component.objects.filter
    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', ''))

    #this is a catch for a variable in the url during testing. aka /getModelJson/components/{{request.id}}/
    if isinstance(id, str) and id.startswith("{{"):
        instance = model.objects.filter().first()
    else:
        instance = model.objects.filter(id=int(id)).first()

    #gets the fields from the model
    modelFields = model._meta.get_fields()
    fields = []
    links = []

    #iterates through the models fields to create a list of fields in the form [field_name,field_type,field_value]
    for field in modelFields:
        #auto created fields are foreign keys etc. from other objects. aka, related_name, not sure if ManyToManys are in here
        if field.auto_created:
            if field.get_internal_type() == 'ForeignKey':
                currentRelated = [object for object in getattr(instance, field.related_name).all()]
                links.append([field.name, field.get_internal_type(), currentRelated, None])
            continue

        if field.get_internal_type() not in ['ForeignKey', 'ManyToManyField']:
            fields.append([field.name, field.get_internal_type(), getattr(instance, field.name)])
        elif field.get_internal_type() == 'ForeignKey':
            foreignKeyObjectsQuery = field.related_model.objects.all()
            foreignKeyObjects = [[object.id, str(object)] for object in foreignKeyObjectsQuery]
            fields.append(
                [field.name, field.get_internal_type(), str(getattr(instance, field.name)), foreignKeyObjects])
        elif field.get_internal_type() == 'ManyToManyField':
            foreignKeyObjectsQuery = field.related_model.objects.all()
            foreignKeyObjects = [[object.id, str(object)] for object in foreignKeyObjectsQuery]

            currentRelatedQuery = getattr(instance, field.name).all()
            currentRelated = [object.id for object in currentRelatedQuery]
            fields.append([field.name, field.get_internal_type(), currentRelated, foreignKeyObjects])

    jsonInstance = dumpInstance(modelName, fields, instance)

    return [jsonInstance]

def getInstancesJson(appLabel, modelName, kwargs):
    # page for adding a new instance
    model = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', ''))
    modelFields = model._meta.get_fields()
    fields = []
    links = []
    print ("KWARGS")
    print (kwargs)

    #this gets all the fields for the model
    instance = model()
    for field in modelFields:
        if field.auto_created:
            if field.get_internal_type() == 'ForeignKey':
                currentRelated = [object for object in getattr(instance, field.related_name).all()]
                links.append([field.name, field.get_internal_type(), currentRelated, None])
            continue
        if field.get_internal_type() not in ['ForeignKey', 'ManyToManyField']:
            fields.append([field.name, field.get_internal_type(), getattr(instance, field.name)])
        elif field.get_internal_type() == 'ForeignKey':
            #I'm getting an error with this variable. It doesn't get used later on??
            foreignKeyObjects = []#getattr(instance, field.name)
            print ('FOREIGN OBJECTS')
            print (foreignKeyObjects)
            fields.append([field.name, field.get_internal_type(), "",#str(getattr(instance, field.name)),
                           foreignKeyObjects, field.related_model._meta.app_label, field.related_model._meta.object_name.lower()])
        elif field.get_internal_type() == 'ManyToManyField':
            foreignKeyObjectsQuery = field.related_model.objects.all()
            foreignKeyObjects = [[object.id, str(object)] for object in foreignKeyObjectsQuery]

            currentRelatedQuery = getattr(instance, field.name).all()
            currentRelated = [object.id for object in currentRelatedQuery]
            fields.append([field.name, field.get_internal_type(), currentRelated, foreignKeyObjects])
    print (fields)
    #gets instances queried by kwargs for a filtered list of the database
    instanceQuery = apps.get_model(app_label=appLabel, model_name=modelName.replace('_', '')).objects.filter(**kwargs).order_by('-id')
    instances = []
    for instance in instanceQuery:
        jsonInstance = dumpInstance(modelName, fields, instance)
        instances.append(jsonInstance)

    return instances


def dumpInstance(modelName, fields, instance):
    jsonInstance = {}
    jsonInstance[modelName] = {}

    for field in fields:
        print (field)
        print (getattr(instance, field[0]))
        if field[1] == 'ForeignKey':
            foreignKeyDict = getInstanceJson(field[4], field[5], getattr(instance, field[0]).id)[0]
            jsonInstance[field[5]] = foreignKeyDict[field[5]]
        else:
            jsonInstance[modelName][field[0]] = getattr(instance, field[0])
