import requests
from bs4 import BeautifulSoup
from home.management.commands.scrapers.basicSpider import BasicSpider


def getText(soup):
    try:
        return soup.getText().strip()
    except:
        return ''


class CrownAndCaliber(BasicSpider):
    def getWatches(self):
        brand_page = requests.get('https://www.crownandcaliber.com/pages/brands')
        brand_soup = BeautifulSoup(brand_page.text, features='html.parser')

        brand_links = brand_soup.find("div", {"class": "brand-listing"}).findAll("a")
        brand_urls = []
        for brand_link in brand_links:
            brand_urls.append([brand_link['href'], brand_link.getText().strip()])

        url = ''
        for brand_url in brand_urls:
            try:
                brand = brand_url[1]
                print(brand)
                added = True
                i = 1
                while added:
                    print(i)
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
                        detail = {'url': 'https://www.crownandcaliber.com' + watch.find("a")['href'],
                                  'reference_number': watch.find("div", {"class": "item-barcode"}).getText().strip(),
                                  'model': watch.find("span", {"class": "itemSubTitle"}).getText().strip(),
                                  'brand': brand}
                        yield detail

                    i += 1
            except Exception as e:
                print(str(e))
                self.sendErrorEmail('Crown And Caliber', 'getWatches: ' + url, str(e))
                yield {'error': True, 'error_detail': str(e)}

    def getWatchDetails(self, url):
        r = requests.get(url)

        soup = BeautifulSoup(r.text, features='html.parser')

        sold = getText(soup.find("label", {"class": "label-newsletter"})).lower()
        if str(sold[:8]) == 'sold out':
            return {'sold': True}

        details = {
            'price': getText(soup.find("span", {"id": "ProductPrice-product-template"})).replace('$', '').replace(
                ',', '')}

        description_dict = {}
        descriptions = soup.select("div.more-detail ul li")
        for desc in descriptions:
            parts = desc.select("span")
            if len(parts) == 0:
                continue
            key = parts[0].text.split(":")[0].strip()
            val = parts[1].text.split("\n")[0].strip()
            description_dict[key] = val

        # TODO not sure if approximate age is the serial year but looks similar
        details['serial_year'] = description_dict["Approximate Age"]
        details['papers'] = description_dict['Papers'] == 'Yes'
        details['box'] = description_dict["Box"] == 'Yes'
        details['manual'] = description_dict["Manual"] == 'Yes'
        condition = description_dict["Condition"]
        if condition.lower() == 'unworn':
            details['condition'] = 'New'
        else:
            details['condition'] = 'Pre-Owned'
        details['wholesale'] = False
        details['image'] = soup.find("img", {"class": "product-featured-img"})['src']
        return details


# CrownAndCaliber().do_testing()
