from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMessage
from home.urls import urlpatterns
from home.models import HistoricPrice
from modelWebsite.models import PageGroup

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        historic_prices = HistoricPrice.objects.all()

        watches = []
        for price in historic_prices:
            if price.watch_instance_id in watches:
                print ("FOUND", price.watch_id)
            else:
                watches.append(price.watch_instance_id)

