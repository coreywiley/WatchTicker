from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMessage
from home.models import UserSettings, Notifications
import datetime
import requests

import json
from django.apps import apps



class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):

        for modelName in ['notifications','usersettings','question','answer','customize','journal','symptom','doctor','faq']:

            model = apps.get_model(app_label='home', model_name=modelName.replace('_', ''))

            # remove data from destination db before copying
            # to avoid primary key conflicts or mismatches
            if model.objects.using('dest').exists():
                model.objects.using('dest').all().delete()

            # get data form the source database
            items = model.objects.using('default').all()

            # process in chunks, to handle models with lots of data

            for item in items:
                print(item, item.__dict__)
                itemDict = item.__dict__
                del itemDict['_state']
                model.objects.using('dest').create(**itemDict)

            # many-to-many fields are NOT handled by bulk create; check for
            # them and use the existing implicit through models to copy them
            #for m2mfield in model._meta.many_to_many:
                #m2m_model = getattr(model, m2mfield.name).through
                #batch_migrate(m2m_model)

