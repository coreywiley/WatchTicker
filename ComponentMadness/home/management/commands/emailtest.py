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

        watch_ids = []

        watch_instances = Watch_Instance.objects.filter(manual=True)
        totalPrice = 0
        count = 0
        for instance in watch_instances:
            totalPrice += instance.price
            count += 1
        print ("With Manual", count, totalPrice/count)

        watch_instances = Watch_Instance.objects.filter(manual=False)
        totalPrice = 0
        count = 0
        for instance in watch_instances:
            try:
                totalPrice += int(instance.price)
                count += 1
            except:
                continue
        print("No Manual", totalPrice, count, totalPrice / count)