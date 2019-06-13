import requests
from bs4 import BeautifulSoup
import json

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

class WatchBox():

    def getWatchBrandUrls(self):
        links = []

        url = 'https://www.thewatchbox.com/all-brands/'
        brand_r = requests.get(url)
        soup = BeautifulSoup(brand_r.text, features='html.parser')

        brand_list = soup.find("div", {"class":"all_brands_list"})
        brand_links = brand_list.findAll("a", href=True)
        for link in brand_links:
            links.append ([link['href'], link.getText().strip()])

        return links

    def getWatches(self):
        brand_urls = [
            ['https://www.thewatchbox.com/watches/6b-watches/', '6B Watches'],
            ['https://www.thewatchbox.com/watches/a-lange-sohne/', 'A. Lange & Sohne'],
            ['https://www.thewatchbox.com/watches/alain-silberstein/', 'Alain Silberstein'],
            ['https://www.thewatchbox.com/watches/alpina/', 'Alpina'],
            ['https://www.thewatchbox.com/watches/anonimo/', 'Anonimo'],
            ['https://www.thewatchbox.com/watches/armand-nicolet/', 'Armand Nicolet'],
            ['https://www.thewatchbox.com/watches/arnold-son/', 'Arnold & Son'],
            ['https://www.thewatchbox.com/watches/audemars-piguet/', 'Audemars Piguet'],
            ['https://www.thewatchbox.com/watches/auto-draft-7/', 'Auto Draft'],
            ['https://www.thewatchbox.com/watches/brm/', 'BRM'],
            ['https://www.thewatchbox.com/watches/ball-watch-company/', 'Ball Watch Company'],
            ['https://www.thewatchbox.com/watches/baume-mercier/', 'Baume & Mercier'],
            ['https://www.thewatchbox.com/watches/bell-ross/', 'Bell & Ross'],
            ['https://www.thewatchbox.com/watches/bernhard-lederer/', 'Bernhard Lederer'],
            ['https://www.thewatchbox.com/watches/blancpain/', 'Blancpain'],
            ['https://www.thewatchbox.com/watches/bovet/', 'Bovet'],
            ['https://www.thewatchbox.com/watches/breguet/', 'Breguet'],
            ['https://www.thewatchbox.com/watches/breitling/', 'Breitling'],
            ['https://www.thewatchbox.com/watches/bremont/', 'Bremont'],
            ['https://www.thewatchbox.com/watches/bucheron/', 'Bucheron'],
            ['https://www.thewatchbox.com/watches/bulgari/', 'Bulgari'],
            ['https://www.thewatchbox.com/watches/carl-f-bucherer/', 'Carl F. Bucherer'],
            ['https://www.thewatchbox.com/watches/cartier/', 'Cartier Watch'],
            ['https://www.thewatchbox.com/watches/casio/', 'Casio'],
            ['https://www.thewatchbox.com/watches/chanel/', 'Chanel'],
            ['https://www.thewatchbox.com/watches/chaumet-2/', 'Chaumet'],
            ['https://www.thewatchbox.com/watches/chopard/', 'Chopard'],
            ['https://www.thewatchbox.com/watches/chronoswiss/', 'Chronoswiss'],
            ['https://www.thewatchbox.com/watches/clerc/', 'Clerc'],
            ['https://www.thewatchbox.com/watches/concord/', 'Concord'],
            ['https://www.thewatchbox.com/watches/corum/', 'Corum'],
            ['https://www.thewatchbox.com/watches/cuervo-y-sobrinos/', 'Cuervo Y Sobrinos'],
            ['https://www.thewatchbox.com/watches/cvstos/', 'Cvstos'],
            ['https://www.thewatchbox.com/watches/cyrus/', 'Cyrus'],
            ['https://www.thewatchbox.com/watches/doxa/', 'DOXA'],
            ['https://www.thewatchbox.com/watches/daniel-roth/', 'Daniel Roth'],
            ['https://www.thewatchbox.com/watches/de-bethune/', 'De Bethune'],
            ['https://www.thewatchbox.com/watches/de-grisogono/', 'De Grisogono'],
            ['https://www.thewatchbox.com/watches/dewitt/', 'DeWitt'],
            ['https://www.thewatchbox.com/watches/devon/', 'Devon'],
            ['https://www.thewatchbox.com/watches/dubey-schaldenbrand/', 'Dubey & Schaldenbrand'],
            ['https://www.thewatchbox.com/watches/ebel/', 'Ebel'],
            ['https://www.thewatchbox.com/watches/eberhard/', 'Eberhard'],
            ['https://www.thewatchbox.com/watches/ernst-benz/', 'Ernst Benz'],
            ['https://www.thewatchbox.com/watches/f-p-journe/', 'F.P. Journe'],
            ['https://www.thewatchbox.com/watches/favre-leuba/', 'Favre-Leuba'],
            ['https://www.thewatchbox.com/watches/franck-muller/', 'Franck Muller'],
            ['https://www.thewatchbox.com/watches/frederique-constant/', 'Frederique Constant'],
            ['https://www.thewatchbox.com/watches/g-shock/', 'G-Shock'],
            ['https://www.thewatchbox.com/watches/gerald-genta/', 'Gerald Genta'],
            ['https://www.thewatchbox.com/watches/gevril/', 'Gevril'],
            ['https://www.thewatchbox.com/watches/girard-perregaux/', 'Girard-Perregaux'],
            ['https://www.thewatchbox.com/watches/giuliano-mazzuoli/', 'Giuliano Mazzuoli'],
            ['https://www.thewatchbox.com/watches/glashutte-original/', 'Glashutte Original'],
            ['https://www.thewatchbox.com/watches/glycine/', 'Glycine'],
            ['https://www.thewatchbox.com/watches/graff/', 'Graff'],
            ['https://www.thewatchbox.com/watches/graham/', 'Graham'],
            ['https://www.thewatchbox.com/watches/grand-seiko/', 'Grand Seiko'],
            ['https://www.thewatchbox.com/watches/greubel-forsey/', 'Greubel Forsey'],
            ['https://www.thewatchbox.com/watches/h-moser-cie/', 'H. Moser & Cie'],
            ['https://www.thewatchbox.com/watches/habring/', 'Habring'],
            ['https://www.thewatchbox.com/watches/hamilton/', 'Hamilton'],
            ['https://www.thewatchbox.com/watches/harry-winston/', 'Harry Winston'],
            ['https://www.thewatchbox.com/watches/harwood/', 'Harwood'],
            ['https://www.thewatchbox.com/watches/hautlence/', 'Hautlence'],
            ['https://www.thewatchbox.com/watches/henry-dunay/', 'Henry Dunay'],
            ['https://www.thewatchbox.com/watches/hermes/', 'Hermès'],
            ['https://www.thewatchbox.com/watches/heuer/', 'Heuer'],
            ['https://www.thewatchbox.com/watches/hublot/', 'Hublot'],
            ['https://www.thewatchbox.com/watches/iwc/', 'IWC'],
            ['https://www.thewatchbox.com/watches/jaeger-lecoultre/', 'Jaeger-LeCoultre'],
            ['https://www.thewatchbox.com/watches/jaquet-droz/', 'Jaquet Droz'],
            ['https://www.thewatchbox.com/watches/jean-richard/', 'Jean Richard'],
            ['https://www.thewatchbox.com/watches/jorg-gray/', 'Jorg Gray'],
            ['https://www.thewatchbox.com/watches/jorg-hysek/', 'Jorg Hysek'],
            ['https://www.thewatchbox.com/watches/kobold/', 'Kobold'],
            ['https://www.thewatchbox.com/watches/laurent-ferrier/', 'Laurent Ferrier'],
            ['https://www.thewatchbox.com/watches/le-phare-2/', 'Le Phare'],
            ['https://www.thewatchbox.com/watches/linde-werdelin/', 'Linde Werdelin'],
            ['https://www.thewatchbox.com/watches/longines/', 'Longines'],
            ['https://www.thewatchbox.com/watches/louis-erard/', 'Louis Erard'],
            ['https://www.thewatchbox.com/watches/louis-moinet/', 'Louis Moinet'],
            ['https://www.thewatchbox.com/watches/louis-vuitton/', 'Louis Vuitton'],
            ['https://www.thewatchbox.com/watches/luminox/', 'Luminox'],
            ['https://www.thewatchbox.com/watches/m-w-galt-bro-co/', 'M.W. Galt Bro & Co.'],
            ['https://www.thewatchbox.com/watches/mb-f/', 'MB & F'],
            ['https://www.thewatchbox.com/watches/mih/', 'MIH'],
            ['https://www.thewatchbox.com/watches/momodesign/', 'MOMODESIGN'],
            ['https://www.thewatchbox.com/watches/manufacture-contemporaine/', 'Manufacture Contemporaine'],
            ['https://www.thewatchbox.com/watches/manufacture-royale/', 'Manufacture Royale'],
            ['https://www.thewatchbox.com/watches/martin-braun/', 'Martin Braun'],
            ['https://www.thewatchbox.com/watches/maurice-lacroix/', 'Maurice Lacroix'],
            ['https://www.thewatchbox.com/watches/maitres-du-temps/', 'Maîtres du Temps'],
            ['https://www.thewatchbox.com/watches/meistersinger/', 'MeisterSinger'],
            ['https://www.thewatchbox.com/watches/mido/', 'Mido'],
            ['https://www.thewatchbox.com/watches/milus/', 'Milus'],
            ['https://www.thewatchbox.com/watches/montblanc/', 'Montblanc'],
            ['https://www.thewatchbox.com/watches/muhle-glashutte/', 'Mühle Glashütte'],
            ['https://www.thewatchbox.com/watches/nomos-glashutte/', 'Nomos Glashutte'],
            ['https://www.thewatchbox.com/watches/oak-oscar/', 'Oak & Oscar'],
            ['https://www.thewatchbox.com/watches/omega/', 'Omega'],
            ['https://www.thewatchbox.com/watches/oris/', 'Oris'],
            ['https://www.thewatchbox.com/watches/panerai/', 'Panerai'],
            ['https://www.thewatchbox.com/watches/parmigiani-fleurier/', 'Parmigiani Fleurier'],
            ['https://www.thewatchbox.com/watches/patek-philippe/', 'Patek Philippe'],
            ['https://www.thewatchbox.com/watches/paul-picot/', 'Paul Picot'],
            ['https://www.thewatchbox.com/watches/pequignet/', 'Pequignet'],
            ['https://www.thewatchbox.com/watches/perrelet/', 'Perrelet'],
            ['https://www.thewatchbox.com/watches/piaget/', 'Piaget'],
            ['https://www.thewatchbox.com/watches/pierre-kunz/', 'Pierre Kunz'],
            ['https://www.thewatchbox.com/watches/porsche-design/', 'Porsche Design'],
            ['https://www.thewatchbox.com/watches/ralph-lauren/', 'Ralph Lauren'],
            ['https://www.thewatchbox.com/watches/raymond-weil/', 'Raymond Weil'],
            ['https://www.thewatchbox.com/watches/ressence/', 'Ressence'],
            ['https://www.thewatchbox.com/watches/richard-mille/', 'Richard Mille'],
            ['https://www.thewatchbox.com/watches/roger-dubuis/', 'Roger Dubuis'],
            ['https://www.thewatchbox.com/watches/rolex/', 'Rolex'],
            ['https://www.thewatchbox.com/watches/romain-jerome/', 'Romain Jerome'],
            ['https://www.thewatchbox.com/watches/sarpaneva/', 'Sarpaneva'],
            ['https://www.thewatchbox.com/watches/schwarz-etienne/', 'Schwarz Etienne'],
            ['https://www.thewatchbox.com/watches/seiko/', 'Seiko'],
            ['https://www.thewatchbox.com/watches/sinn/', 'Sinn'],
            ['https://www.thewatchbox.com/watches/speake-marin/', 'Speake-Marin'],
            ['https://www.thewatchbox.com/watches/tag-heuer/', 'Tag Heuer'],
            ['https://www.thewatchbox.com/watches/tiffany-co/', 'Tiffany & Co.'],
            ['https://www.thewatchbox.com/watches/tudor/', 'Tudor'],
            ['https://www.thewatchbox.com/watches/tutima/', 'Tutima'],
            ['https://www.thewatchbox.com/watches/u-boat/', 'U-Boat'],
            ['https://www.thewatchbox.com/watches/ulysse-nardin/', 'Ulysse Nardin'],
            ['https://www.thewatchbox.com/watches/urban-jurgensen/', 'Urban Jurgensen'],
            ['https://www.thewatchbox.com/watches/urwerk/', 'Urwerk'],
            ['https://www.thewatchbox.com/watches/vacheron-constantin/', 'Vacheron Constantin'],
            ['https://www.thewatchbox.com/watches/van-cleef-arpels/', 'Van Cleef & Arpels'],
            ['https://www.thewatchbox.com/watches/visconti/', 'Visconti'],
            ['https://www.thewatchbox.com/watches/vogard/', 'Vogard'],
            ['https://www.thewatchbox.com/watches/vulcain/', 'Vulcain'],
            ['https://www.thewatchbox.com/watches/wakmann/', 'Wakmann'],
            ['https://www.thewatchbox.com/watches/wempe/', 'Wempe'],
            ['https://www.thewatchbox.com/watches/zenith/', 'Zenith'],
            ['https://www.thewatchbox.com/watches/zodiac/', 'Zodiac']
        ]


        watch_list = []
        for brand_url in brand_urls:
            try:
                brand = brand_url[1]
                print (brand)

                if not brand_url:
                    continue

                try:
                    brand_r = requests.get(brand_url[0])
                except Exception as e:
                    print(e)
                    continue

                soup = BeautifulSoup(brand_r.text, features='html.parser')

                html_models = soup.find("ul", {"class":"watch-models"}).findAll("li")
                for html_model in html_models:
                    model = html_model.find("div", {"class":"model"}).getText().strip()

                    url = html_model.find("a")['href']
                    try:
                        r = requests.get(url)
                    except Exception as e:
                        print (e)
                        continue


                    page_text = r.text
                    start = page_text.find('var filters_presets = ')
                    end = page_text.find('var filters_presets_selected = ')
                    format = page_text[start + 22:end].strip()[1:-2].replace('\\\\\\"',"'").replace("\\","")

                    watches = json.loads(format)['products']['list']


                    #soup = BeautifulSoup(r.text, features='html.parser')
                    #print (soup)
                    #watches = soup.find("ul", {"class": "products"}).findAll("li", {"class":"product"})
                    #print ("Watches")
                    for watch in watches:
                        detail = {}
                        detail['url'] = watch['url']
                        detail['reference_number'] = watch['mpn']
                        detail['brand'] = brand
                        detail['model'] = model
                        yield detail
            except Exception as e:
                print(str(e))
                sendErrorEmail('Watch Box', 'getWatches: ' + brand_url, str(e))
                yield {'error': True, 'error_detail': str(e)}




    def getWatchDetails(self, url):
        r = requests.get(url)
        soup = BeautifulSoup(r.text, features='html.parser')

        sold = soup.find("p", {"class":"outofstock"})
        if sold:
            return {'sold':True}

        details = {}

        details['price'] = soup.find("span", {"itemprop": "price"}).getText().strip().replace('$','').replace(',','')


        about_section = re.search("<p>.*Serial.*</p>", r.text)

        if about_section:
            details['serial_year'] = about_section.group(0).split('.')[-2].strip()

        paper_details = soup.find("table", {"class":"watch-attributes"}).findAll("td")[5].getText().strip().lower()

        details['papers'] = 'paper' in paper_details and 'no' not in paper_details
        details['box'] = 'box' in paper_details and 'no' not in paper_details
        details['manual'] = 'manual' in paper_details and 'no' not in paper_details
        details['image'] = soup.find("img", {"class":"size-wooslider-featured-image"})['src']
        try:
            condition = soup.find("div", {"class":"product-preowned"}).getText().strip().lower()
            details['condition'] = 'Pre-Owned'
        except:
            details['condition'] = 'New'

        details['wholesale'] = False

        return details


#source = WatchBox()

#print (source.getWatches())
#print (source.getWatchDetails('https://www.thewatchbox.com/shop/pre-owned-rolex-submariner-116610ln-33/'))
#print (source.getWatchBrandUrls())
