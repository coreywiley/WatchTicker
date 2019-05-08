import requests
from bs4 import BeautifulSoup

class CrownAndCaliber():

    def getWatchUrls(self):
        brand_page = requests.get('https://www.crownandcaliber.com/pages/brands')
        brand_soup = BeautifulSoup(brand_page.text, features='html.parser')

        brand_links = brand_soup.find("div", {"class":"brand-listing"}).findAll("a")

        brand_urls = []
        for brand_link in brand_links:
            brand_urls.append([brand_link['href'], brand_link.getText().strip()])

        for brand_url in brand_urls:
            brand = brand_url[1]


            added = True
            i = 1
            while added:
                url = 'https://www.crownandcaliber.com%s?page=%s' % (brand_url[0], i)
                r = requests.get(url)
                print (r.text)
                added = False

                soup = BeautifulSoup(r.text, features='html.parser')

                watch_list = []
                watches = soup.findAll("div", {"class": "itemBox"})
                added = False
                for watch in watches:
                    added = True
                    detail = {}
                    detail['url'] = 'https://www.crownandcaliber.com' + watch.find("a")['href']
                    detail['reference_number'] = watch.find("div", {"class": "item-barcode"}).getText().strip()
                    detail['model'] = watch.find("span", {"class":"itemSubTitle"}).getText().strip()
                    detail['brand'] = brand
                    watch_list.append(detail)

                i += 1


        return watch_list


    def getWatchDetails(self, url):
        r = requests.get(url)
        soup = BeautifulSoup(r.text, features='html.parser')

        details = {}

        details['price'] = soup.find("span", {"id": "ProductPrice-product-template"}).getText().strip().replace('$','').replace(',','')
        #details['serial_year'] = soup.find("li", {"class": "serial-year"}).find("span", {"class":"attribute-value"}).getText().strip()

        description = soup.find("div",{"class":"more-detail"}).find("div", {"itemprop":"description"}).findAll("span")
        print (len(description))

        details['papers'] = description[31].getText().strip()
        details['box'] = description[29].getText().strip()
        details['manual'] = description[33].getText().strip()
        condition = description[7].getText().strip()
        condition = condition[:condition.find(' ')]

        details['condition'] = condition
        details['image'] = soup.find("img", {"class":"product-featured-img"})['src']

        return details


source = CrownAndCaliber()
print (source.getWatchDetails('https://www.crownandcaliber.com/collections/a-lange-sohne-watches/products/a-lange-sohne-1815-rose-gold-235-032-10-10-als-659v7h'))

#print (source.getWatchUrls())




