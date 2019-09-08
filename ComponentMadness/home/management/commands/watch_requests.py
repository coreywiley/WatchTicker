from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMessage
import datetime

import sendgrid
from sendgrid.helpers.mail import *
from django.conf import settings

from home.models import Watch, Watch_Instance, WatchRequest

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

       watch_requests = WatchRequest.objects.all()
       for request in watch_requests:
           print ("Watch Request", request, request.max_price)

           if request.max_price > 0:
               instances = Watch_Instance.objects.filter(watch=request.watch, sold_time=None,
                                                         price__gte=request.min_price)
           else:
               instances = Watch_Instance.objects.filter(watch=request.watch, sold_time=None,
                                                         price__gte=request.min_price, price__lte=request.max_price)

           if instances.count() > 0:
               links = ''
               print ("Found Match")
               for instance in instances:
                   if 'http' in instance.url:
                       links += "<a href='%s'>%s</a><br/>" % (instance.url, instance.source.name)
                   else:
                       links += "<a href='%s'>%s : %s</a><br/>" % (instance.source.url, instance.source.name, instance.url)

               text = '<p>We found a match for a watch request:</p><p>Name: %s</p><p>Phone: %s</p><p>Email: %s</p><p>Reference Number: %s</p><p>Min Price: %s</p><p>Max Price: %s</p><p>Notes: %s</p><p></p><h5>Links:</h5>%s' % (request.name, request.phone, request.email, request.reference_number, request.min_price, request.max_price, request.notes, links)
               sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)
               from_email = Email('jeremy.thiesen1@gmail.com')
               to_email = Email('corey@watchchest.com')
               subject = 'Watch Ticker Request Match'
               content = Content("text/html", text)

               mail = Mail(from_email, subject, to_email, content)
               response = sg.client.mail.send.post(request_body=mail.get())
