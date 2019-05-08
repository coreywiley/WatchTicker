import requests
from bs4 import BeautifulSoup
import json

class WatchBox():

    def getWatchUrls(self):
        brand_urls = [
            ['https://www.thewatchbox.com/watches/rolex/', 'Rolex'],
        ]

        watch_list = []
        print (brand_urls)
        for brand_url in brand_urls:
            brand = brand_url[1]
            if not brand_url:
                continue
            brand_r = requests.get(brand_url[0])
            soup = BeautifulSoup(brand_r.text, features='html.parser')

            html_models = soup.find("ul", {"class":"watch-models"}).findAll("li")
            for html_model in html_models:
                model = html_model.find("div", {"class":"model"}).getText().strip()

                url = html_model.find("a")['href']
                print ("Url", url)
                r = requests.get(url)

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
                    watch_list.append(detail)

                break

        return watch_list


    def getWatchDetails(self, url):
        r = requests.get(url)
        soup = BeautifulSoup(r.text, features='html.parser')

        details = {}

        details['price'] = soup.find("span", {"itemprop": "price"}).getText().strip().replace('$','').replace(',','')
        #details['serial_year'] = soup.find("li", {"class": "serial-year"}).find("span", {"class":"attribute-value"}).getText().strip()
        details['papers'] = soup.find("table", {"class":"watch-attributes"}).findAll("td")[5].getText().strip()
        details['image'] = soup.find("img", {"class":"size-wooslider-featured-image"})['src']

        return details


source = WatchBox()

#print (source.getWatchUrls())
print (source.getWatchDetails('https://www.thewatchbox.com/shop/pre-owned-rolex-datejust-279171/'))
