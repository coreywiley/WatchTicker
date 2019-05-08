import requests
from bs4 import BeautifulSoup

class HouseOfTime():

    def getWatchUrls(self):
        added = True
        i = 1
        while added:
            url = 'http://houseoftime1.com/product-category/view-all/page/%s/' % (i)
            r = requests.get(url)

            soup = BeautifulSoup(r.text, features='html.parser')

            watch_list = []
            watches = soup.findAll("div", {"class": "product"})
            added = False
            for watch in watches:
                added = True
                detail = {}
                detail['url'] = watch.find("a", {"class": "woocommerce-LoopProduct-link"})['href']
                detail['reference_number'] = watch.find("li", {"class": "reference"}).find("span", {"class": "attribute-value"}).getText().strip()
                watch_list.append(detail)

            i += 1
        return watch_list


    def getWatchDetails(self, url):
        r = requests.get(url)
        soup = BeautifulSoup(r.text, features='html.parser')

        details = {}

        details['price'] = soup.find("span", {"class": "woocommerce-Price-amount"}).getText().strip().replace('$','').replace(',','')
        details['serial_year'] = soup.find("li", {"class": "serial-year"}).find("span", {"class":"attribute-value"}).getText().strip()
        details['papers'] = soup.find("li", {"class":"papers"}).find("span", {"class":"attribute-value"}).getText().strip()
        details['image'] = soup.find("img", {"class":"wp-post-image"})['src']

        return details


source = HouseOfTime()
print (source.getWatchDetails('http://houseoftime1.com/product/16233-30/'))

#print (getWatchUrls())