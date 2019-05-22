import pandas as pd

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

brand_reference_dict = {
            'AP':'Audemars Piguet',
            'BR': 'Breitling',
            'CR': 'Cartier Watch',
            'HU': 'Hublot',
            'IWC':'IWC',
            'LS': 'A. Lange & Sohne',
            'OM': "Omega",
            'OP': 'Panerai',
            'PP': 'Patek Philippe',
            'RX':'Rolex',
            'TH':'Tag Heuer',
        }

class WeLoveWatches():
    def __init__(self):
        table = pd.read_html('https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQhzAp8r-Po0KalE6Te3kpZ0ZKByk4LT_cA6PfgESjh6YN5gzW4RpjwrFEhWwZwxBy5CnAJuNZdUCN6/pubhtml?gid=735652720&single=true')[0]
        table.columns = table.iloc[1, :]
        table = table.iloc[3:, 3:-1]
        table = table.dropna(how="all")

        self.table = table

    def getWatches(self):
        watches = []

        for index,row in self.table.iterrows():
            watch_detail = {}

            if row[1] in brand_reference_dict:
                brand = brand_reference_dict[row[1]]
                watch_detail['brand'] = brand

            watch_detail['reference_number'] = row[2]
            watch_detail['url'] = row[0]


            yield watch_detail


    def getWatchDetails(self, stock_num):

        details = {}
        found = False
        for index, row in self.table.iterrows():
            if row[0] == stock_num:
                found = True
                details['brand'] = brand_reference_dict.get(row[1], row[1])
                details['reference_number'] = row[2]
                details['serial_year'] = row[3]
                details['papers'] = row[5] in ['PAPER','CARD']
                details['box'] = row[7] == 'BOX'
                details['wholesale'] = True
                details['condition'] = 'Pre-Owned'
                try:
                    details['price'] = row[9].replace('$','').replace(',','')
                except:
                    details['price'] = row[9]

        if not found:
            return {'sold':True}

        return details

        #table.to_csv("stock_available.csv", index=False)


#source = WeLoveWatches()


#print (source.getWatches())
