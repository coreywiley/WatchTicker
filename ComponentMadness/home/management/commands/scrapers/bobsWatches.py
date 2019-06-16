import requests
from bs4 import BeautifulSoup
from home.management.commands.scrapers.basicSpider import BasicSpider


class BobsWatches(BasicSpider):
    def getWatches(self):
        added = True
        i = 1
        while added:
            try:
                print(i)
                url = 'https://www.bobswatches.com/luxury-watches/?p=%s' % i
                r = requests.get(url)
                if 'Recently Sold' in r.text:
                    break

                soup = BeautifulSoup(r.text, features='html.parser')

                watches = soup.find("div", {"class": "itemResults"}).findAll("div", {"class": "item"})
                added = False
                for watch in watches:
                    added = True
                    detail = {'url': watch.find("p", {"class": "itemimage"}).find("a")['href']}

                    reference_number = False
                    description = watch.find("h2").find("span").find("span").getText()

                    for s in description.split(" "):
                        if s.isdigit():
                            reference_number = s

                    if not reference_number:
                        description = watch.find("h2").getText().strip()

                        d_split = description.split(" ")
                        for j in range(len(d_split)):
                            if d_split[j] == 'Ref':
                                reference_number = d_split[j + 1]

                    if reference_number:
                        detail['reference_number'] = reference_number
                        yield detail
            except Exception as e:
                print(str(e))
                self.sendErrorEmail('Bobs Watches', 'getWatches: ' + url, str(e))
                yield {'error': True, 'error_detail': str(e)}

            i += 1

    def getWatchDetails(self, url):
        r = requests.get(url)

        if 'this item is no longer in stock' in r.text.lower():
            return {'sold': True}

        soup = BeautifulSoup(r.text, features='html.parser')

        details = {
            'price': soup.find("span", {"class": "price"}).getText().strip().replace('$', '').replace(',', '').replace(
                ' Cash Wire Price', '')}

        condition = soup.findAll("td", {"class": "condition"})
        if condition:
            condition = condition[1].getText().strip()

            if condition.lower() == 'unworn':
                details['condition'] = 'New'
            else:
                details['condition'] = 'Pre-Owned'
        else:
            details['condition'] = 'Pre-Owned'
        details['wholesale'] = False

        desc_table = soup.find("span", {"itemprop": "description"}).find("table").findAll("td")
        details['model'] = desc_table[1].getText().strip()
        details['serial_year'] = desc_table[3].getText().strip()

        paper_details = desc_table[15].getText().strip().lower()

        details['papers'] = 'paper' in paper_details or 'card' in paper_details
        details['box'] = 'box' in paper_details
        details['manual'] = 'manual' in paper_details
        details['image'] = 'https://www.bobswatches.com/' + soup.find("img", {"class": "photo"})['src']

        return details


# BobsWatches().do_testing()
