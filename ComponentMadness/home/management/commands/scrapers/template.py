import requests
from bs4 import BeautifulSoup
import re

import sendgrid
from sendgrid.helpers.mail import *
from django.conf import settings

def sendErrorEmail(source, function, error):

    # using SendGrid's Python Library
    # https://github.com/sendgrid/sendgrid-python
    sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)
    from_email = Email('igugu13@freeuni.edu.ge')
    to_email = Email('igugu13@freeuni.edu.ge')
    subject = 'Watch Ticker Scraper Not Operating Correctly'
    content = Content("text/html", "%s failed during function: %s with error: %s" % (source,function, error))

    mail = Mail(from_email, subject, to_email, content)
    response = sg.client.mail.send.post(request_body=mail.get())

class Template():

    #yeilds each individual watch with reference_number and url required, brand and model options
    def getWatches(self):

        url = 'https://www.bobswatches.com/luxury-watches/?p=%s' % (i)
        r = requests.get(url)
        soup = BeautifulSoup(r.text, features='html.parser')

        for watch in soup.findAll("div",{"class":"watches"}):
            try:
                detail = {}
                detail['reference_number'] = watch.find("div")
                detail['url'] = watch.find("a").href
                yield detail
            except Exception as e:
                print(str(e))
                sendErrorEmail('Template', 'getWatches: ' + url, str(e))
                yield {'error': True, 'error_detail': str(e)}


    #gets watch from a specific url passed to the function and returns several watch details or if sold, a sold parameter
    def getWatchDetails(self, url):
        r = requests.get(url)

        if 'this item is no longer in stock' in r.text.lower():
            return {'sold':True}

        soup = BeautifulSoup(r.text, features='html.parser')

        details = {}

        #price should be just a number, no $ or commas
        details['price'] = soup.find("span", {"class": "price"}).getText().strip().replace('$','').replace(',','')

        condition = soup.findAll("td", {"class":"condition"})

        #condition should always be New or Pre-Owned
        if condition.lower() == 'unworn':
            details['condition'] = 'New'
        else:
            details['condition'] = 'Pre-Owned'

        #wholesale is by source url as true or false, not found on page.
        details['wholesale'] = False

        desc_table = soup.find("span", {"itemprop":"description"}).find("table").findAll("td")
        details['model'] = desc_table[1].getText().strip()

        #serial_year as a string
        details['serial_year'] = desc_table[3].getText().strip()

        #papers, box and manual are all True or False of whether the watch comes with them or not
        paper_details = desc_table[15].getText().strip().lower()
        details['papers'] = 'paper' in paper_details or 'card' in paper_details
        details['box'] = 'box' in paper_details
        details['manual'] = 'manual' in paper_details

        #url of the image
        details['image'] = 'https://www.bobswatches.com/' + soup.find("img", {"class":"photo"})['src']

        return details



#source = BobsWatches()
#print (source.getWatchDetails('https://www.bobswatches.com/pre-owned-rolex-president-18038-champagne-roman.html'))



