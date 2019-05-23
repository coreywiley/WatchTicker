from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMessage
import datetime
import pickle

from home.management.commands.scrapers.bobsWatches import BobsWatches
from home.management.commands.scrapers.crownAndCaliber import CrownAndCaliber
from home.management.commands.scrapers.houseOfTime import HouseOfTime
from home.management.commands.scrapers.watchBox import WatchBox
from home.management.commands.scrapers.weLoveWatches import WeLoveWatches
from home.management.commands.scrapers.bonetawholesale import BonetaWholesale

import sendgrid
from sendgrid.helpers.mail import *
from django.conf import settings

from home.models import Watch, Watch_Instance, Source, HistoricPrice

def sendErrorEmail(source, function, error):

    # using SendGrid's Python Library
    # https://github.com/sendgrid/sendgrid-python
    sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)
    from_email = Email('jeremy.thiesen1@gmail.com')
    to_email = Email('jeremy.thiesen1@gmail.com')
    subject = 'Watch Ticker Scraper Not Operating Correctly'
    content = Content("text/html", "%s failed during function: %s with error: %s" % (source,function, error))

    mail = Mail(from_email, subject, to_email, content)
    response = sg.client.mail.send.post(request_body=mail.get())

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        parser.add_argument('source', type=str, help='Indicates Source To Be Ran')

    def handle(self, *args, **options):
        source = options['source']

        watch_websites = {"We Love Watches":WeLoveWatches, "Bob's Watches":BobsWatches, 'House Of Time':HouseOfTime,
                          'Crown And Caliber':CrownAndCaliber, "Watch Box":WatchBox, "Boneta Wholesale":BonetaWholesale}

        print ('\n\n\n\n', source, '\n')
        instance = watch_websites[source]()


        source_instance = Source.objects.filter(name=source).first()
        if not source_instance:
            source_instance = Source(name=source)
            source_instance.save()

        source_instance.last_updated_watch = datetime.datetime.now()
        source_instance.save()


        watches = instance.getWatches()
        for watch in watches:
            if 'error' in watch and watch['error'] == True:
                print ("\n\n\n", watch, "\n\n\n")
                continue

            print ("\n\n\n","Watch", watch, "\n\n\n")
            #check for watch reference number
            watch_instance = Watch.objects.filter(reference_number__iexact=watch['reference_number']).first()
            if watch_instance:
                change = False
                if watch_instance.brand == '' and 'brand' in watch:
                    change = True
                    watch_instance.brand = watch['brand']
                if watch_instance.model == '' and 'model' in watch:
                    change = True
                    watch_instance.model = watch['model']

                if change:
                    watch_instance.save()
            else:
                model = ''
                brand = ''
                if 'model' in watch:
                    model = watch['model']
                if 'brand' in watch:
                    brand = watch['brand']

                watch_instance = Watch(reference_number = watch['reference_number'], model = model, brand = brand)
                print ("\n\n\n", "Saving New Watch", watch, "\n\n\n")
                watch_instance.save()


            try:
                check = Watch_Instance.objects.filter(watch_id=watch_instance.id, source_id=source_instance.id, url=watch['url']).first()

                if not check:

                    print ("\n\n\n", "Watch Instance", watch_instance.reference_number, source_instance.name, watch['url'], watch, "\n\n\n")
                    new_instance = Watch_Instance(watch=watch_instance, source=source_instance, url=watch['url'])
                    new_instance.save()
            except Exception as e:
                print (str(e))
                sendErrorEmail(source, 'getWatches', str(e))

        print ('\n\n\n\n', source, '\n')
        #instance = watch_websites[source]()

        source_instance = Source.objects.filter(name=source).first()

        all_watches = Watch_Instance.objects.filter(source=source_instance, sold_time=None)
        print (all_watches.count())
        for watch in all_watches:

            try:
                watch_details = instance.getWatchDetails(watch.url)
            except Exception as e:
                print (str(e))
                print (watch.url)
                sendErrorEmail(source_instance.name, 'getWatchDetails : ' + watch.url, str(e))
                continue

            if 'sold' in watch_details and watch_details['sold']:
                print ("\n\n\n\n", "SOLD", watch.url, "\n\n\n\n")
                watch.sold_time = datetime.datetime.now()
                watch.save()
            else:
                watch.condition = watch_details.get('condition','')
                watch.papers = watch_details.get('papers',False)
                watch.box = watch_details.get('box',False)
                watch.manual = watch_details.get('manual',False)
                watch.image = watch_details.get('image','')
                watch.price = watch_details.get('price','')
                watch.wholesale = watch_details.get('wholesale',True)
                watch.info = watch_details.get('serial_year', '')
                watch.save()

                check = HistoricPrice.objects.filter(watch_instance_id=watch.id).order_by('-created_at').first()
                if check:
                    if float(check.price) != float(watch_details['price']) and float(watch_details['price']) > 0:
                        print ("\n", "Check Price", check.price, "Watch Price", watch_details['price'], "\n")
                        new_price = HistoricPrice(watch_instance_id=watch.id, watch_id=watch.watch_id, price=watch_details['price'])
                        new_price.save()
                else:
                    new_price = HistoricPrice(watch_instance_id=watch.id, watch_id=watch.watch_id, price=watch_details['price'])
                    new_price.save()
        source_instance.last_updated_detail = datetime.datetime.now()
        source_instance.save()






