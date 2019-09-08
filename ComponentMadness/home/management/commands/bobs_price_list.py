from django.core.management.base import BaseCommand, CommandError
from django.core.mail import EmailMessage
import datetime

import sendgrid
from sendgrid.helpers.mail import *
from django.conf import settings
from home.management.commands.scrapers.SellRolexBobswatches import get_all_prices

from home.models import Watch, Watch_Instance, WatchRequest, InstantQuote

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
        price_list = get_all_prices()

        for price in price_list:
            check = InstantQuote.objects.filter(reference_number=price['model']).first()
            buy_price = price['buy_price'].replace('$','').replace(',','')
            try:
                if check:
                    check.price = buy_price
                    check.save()
                else:
                    instant_quote = InstantQuote(reference_number = price['model'], gender=price['gender'], name=price['name'], description=price['description'],price=buy_price)
                    instant_quote.save()
            except:
                print ('\n\n\n', buy_price, '\n\n\n')
