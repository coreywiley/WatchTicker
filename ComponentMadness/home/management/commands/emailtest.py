from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMessage
from home.urls import urlpatterns

from modelWebsite.models import PageGroup

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        page_group = PageGroup(name='Made From Models')
        page_group.save()

