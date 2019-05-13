from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMessage
import datetime

from home.management.commands.scrapers.bobsWatches import BobsWatches
from home.management.commands.scrapers.crownAndCaliber import CrownAndCaliber
from home.management.commands.scrapers.houseOfTime import HouseOfTime
from home.management.commands.scrapers.watchBox import WatchBox
from home.management.commands.scrapers.weLoveWatches import WeLoveWatches

import sendgrid
from sendgrid.helpers.mail import *
from django.conf import settings

from home.models import Watch, Watch_Instance, Source, HistoricPrice

def sendErrorEmail(source, function):

    # using SendGrid's Python Library
    # https://github.com/sendgrid/sendgrid-python
    sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)
    from_email = Email('jeremy.thiesen1@gmail.com')
    to_email = Email('jeremy.thiesen1@gmail.com')
    subject = 'Watch Ticker Scraper Not Operating Correctly'
    content = Content("text/html", "%s failed during function: %s" % (source,function))

    mail = Mail(from_email, subject, to_email, content)
    response = sg.client.mail.send.post(request_body=mail.get())

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):

       watches = Watch.objects.all()
       for watch in watches:
           watch.delete()