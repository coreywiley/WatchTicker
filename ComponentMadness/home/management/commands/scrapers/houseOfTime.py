import requests
from bs4 import BeautifulSoup

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

class HouseOfTime():

    def getWatches(self):
        added = True
        i = 1
        watch_list = []
        url = ''
        while added:
            try:
                print (i)
                url = 'http://houseoftime1.com/product-category/view-all/page/%s/' % (i)
                r = requests.get(url)

                soup = BeautifulSoup(r.text, features='html.parser')


                watches = soup.findAll("div", {"class": "product"})
                added = False
                for watch in watches:
                    added = True
                    detail = {}
                    detail['url'] = watch.find("a", {"class": "woocommerce-LoopProduct-link"})['href']
                    detail['reference_number'] = watch.find("li", {"class": "reference"}).find("span", {"class": "attribute-value"}).getText().strip()
                    yield detail

                i += 1
            except Exception as e:
                print(str(e))
                sendErrorEmail('House Of Time', 'getWatches: ' + url, str(e))
                yield {'error': True, 'error_detail': str(e)}


    def getWatchDetails(self, url):

        r = requests.get(url)
        if 'Page not found' in r.text:
            return {'sold':True}

        soup = BeautifulSoup(r.text, features='html.parser')

        details = {}

        details['price'] = soup.find("span", {"class": "woocommerce-Price-amount"}).getText().strip().replace('$','').replace(',','')
        details['serial_year'] = soup.find("li", {"class": "serial-year"}).find("span", {"class":"attribute-value"}).getText().strip()
        details['papers'] = soup.find("li", {"class":"papers"}).find("span", {"class":"attribute-value"}).getText().strip() == 'Yes'
        details['image'] = soup.find("img", {"class":"wp-post-image"})['src']
        details['wholesale'] = True
        details['condition'] = 'Pre-Owned'

        return details


#source = HouseOfTime()
#print (source.getWatchDetails('http://houseoftime1.com/product/omega/'))
#print (source.getWatches())