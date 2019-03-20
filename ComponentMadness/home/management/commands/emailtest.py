from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMessage
from home.urls import urlpatterns

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        print ('URL Patterns')
        for url in urlpatterns:
            print (url.__dict__['pattern'])
