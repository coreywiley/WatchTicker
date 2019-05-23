from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMessage
from home.urls import urlpatterns
from home.models import HistoricPrice, Watch_Instance, Watch, Source
from modelWebsite.models import PageGroup

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        '''
        watches = Watch.objects.all()

        brands = []
        brand_options = []
        for watch in watches:
            if watch.brand.lower() not in brands:
                brands.append(watch.brand.lower())
                brand_options.append({'text': watch.brand.title(),'value': watch.brand.lower()})

        print (brand_options)
        '''

        watch_ids = {}

        instances = Watch_Instance.objects.all()

        for instance in instances:
            if instance.watch_id not in watch_ids:
                watch_ids[instance.watch_id] = 0
            watch_ids[instance.watch_id] += 1

        max_num = 0
        max_id = ''
        for id in watch_ids:
            if watch_ids[id] > max_num:
                max_num = watch_ids[id]
                max_id = id
        print (id)