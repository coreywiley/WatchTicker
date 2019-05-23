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

        sources = {"We Love Watches": "https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQhzAp8r-Po0KalE6Te3kpZ0ZKByk4LT_cA6PfgESjh6YN5gzW4RpjwrFEhWwZwxBy5CnAJuNZdUCN6/pubhtml?gid=735652720&single=true",
                   "Bob's Watches": "https://www.bobswatches.com/", 'House Of Time': "http://houseoftime1.com/",
         'Crown And Caliber': "https://www.crownandcaliber.com", "Watch Box": "https://www.thewatchbox.com/", "Boneta Wholesale": "https://bonetawholesale.com/"}

        for source in sources:
            instance = Source.objects.filter(name=source).first()
            instance.url = sources[source]
            instance.save()
