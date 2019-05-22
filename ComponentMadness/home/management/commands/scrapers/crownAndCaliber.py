import requests
from bs4 import BeautifulSoup

import sendgrid
from sendgrid.helpers.mail import *
from django.conf import settings

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

class CrownAndCaliber():

    def getWatches(self):
        brand_page = requests.get('https://www.crownandcaliber.com/pages/brands')
        brand_soup = BeautifulSoup(brand_page.text, features='html.parser')

        brand_links = brand_soup.find("div", {"class":"brand-listing"}).findAll("a")
        watch_list = []
        brand_urls = []
        for brand_link in brand_links:
            brand_urls.append([brand_link['href'], brand_link.getText().strip()])

        url = ''
        for brand_url in brand_urls:
            try:
                brand = brand_url[1]
                print (brand)
                added = True
                i = 1
                while added:
                    print (i)
                    url = 'https://www.crownandcaliber.com%s?page=%s' % (brand_url[0], i)
                    try:
                        r = requests.get(url)
                    except:
                        added = False
                        continue

                    soup = BeautifulSoup(r.text, features='html.parser')

                    watches = soup.findAll("div", {"class": "itemBox"})
                    added = False
                    for watch in watches:
                        added = True
                        detail = {}
                        detail['url'] = 'https://www.crownandcaliber.com' + watch.find("a")['href']
                        detail['reference_number'] = watch.find("div", {"class": "item-barcode"}).getText().strip()
                        detail['model'] = watch.find("span", {"class":"itemSubTitle"}).getText().strip()
                        detail['brand'] = brand
                        yield detail

                    i += 1
            except Exception as e:
                print(str(e))
                sendErrorEmail('Crown And Caliber', 'getWatches: ' + url, str(e))
                yield {'error': True, 'error_detail': str(e)}




    def getWatchDetails(self, url):
        r = requests.get(url)
        soup = BeautifulSoup(r.text, features='html.parser')

        details = {}

        details['price'] = soup.find("span", {"id": "ProductPrice-product-template"}).getText().strip().replace('$','').replace(',','')
        #details['serial_year'] = soup.find("li", {"class": "serial-year"}).find("span", {"class":"attribute-value"}).getText().strip()

        description = soup.find("div",{"class":"more-detail"}).find("div", {"itemprop":"description"}).findAll("span")
        print (len(description))

        details['papers'] = description[31].getText().strip() == 'Yes'
        details['box'] = description[29].getText().strip() == 'Yes'
        details['manual'] = description[33].getText().strip() == 'Yes'
        condition = description[7].getText().strip()
        condition = condition[:condition.find(' ')]
        if condition.lower() == 'unworn':
            details['condition'] = 'New'
        else:
            details['condition'] = 'Pre-Owned'
        details['wholesale'] = False


        details['image'] = soup.find("img", {"class":"product-featured-img"})['src']

        return details


#source = CrownAndCaliber()
#print (source.getWatchDetails('https://www.crownandcaliber.com/collections/a-lange-sohne-watches/products/a-lange-sohne-1815-rose-gold-235-032-10-10-als-659v7h'))

#print (source.getWatches())




