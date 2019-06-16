import requests
from bs4 import BeautifulSoup
from home.management.commands.scrapers.basicSpider import BasicSpider


class HouseOfTime(BasicSpider):

    def getWatches(self):
        added = True
        i = 1
        url = ''
        while added:
            try:
                print(i)
                url = 'http://houseoftime1.com/product-category/view-all/page/%s/' % i
                r = requests.get(url)

                soup = BeautifulSoup(r.text, features='html.parser')

                watches = soup.findAll("div", {"class": "product"})
                added = False
                for watch in watches:
                    added = True
                    detail = {'url': watch.find("a", {"class": "woocommerce-LoopProduct-link"})['href'],
                              'reference_number': watch.find("li", {"class": "reference"}).find("span", {
                                  "class": "attribute-value"}).getText().strip()}
                    yield detail

                i += 1
            except Exception as e:
                print(str(e))
                self.sendErrorEmail('House Of Time', 'getWatches: ' + url, str(e))
                yield {'error': True, 'error_detail': str(e)}

    def getWatchDetails(self, url):

        r = requests.get(url)
        if 'Page not found' in r.text:
            return {'sold': True}

        soup = BeautifulSoup(r.text, features='html.parser')

        details = {'price': soup.find("span", {"class": "woocommerce-Price-amount"}).getText().strip().replace('$', '').
            replace(
            ',', ''), 'serial_year': soup.find("li", {"class": "serial-year"}).find("span", {
                "class": "attribute-value"}).getText().strip(),
            'papers': soup.find("li", {"class": "papers"}).find("span", {
                "class": "attribute-value"}).getText().strip() == 'Yes',
            'image': soup.find("img", {"class": "wp-post-image"})['src'], 'wholesale': True, 'condition': 'Pre-Owned'}

        return details


# HouseOfTime().do_testing()
