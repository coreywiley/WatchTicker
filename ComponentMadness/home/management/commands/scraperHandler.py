from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMessage

from scrapers.bobsWatches import BobsWatches
from scrapers.crownAndCaliber import CrownAndCaliber
from scrapers.houseOfTime import HouseOfTime
from scrapers.watchBox import WatchBox
from scrapers.weLoveWatches import WeLoveWatches


'''
class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        print ('URL Patterns')
        for url in urlpatterns:
            print (url.__dict__['pattern'])
'''


watch_wesbites = [BobsWatches()]