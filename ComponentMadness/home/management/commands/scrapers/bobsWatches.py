import requests
from bs4 import BeautifulSoup
import re

class BobsWatches():

    def getWatches(self):
        added = True
        i = 1
        watch_list = []
        while added:
            print (i)
            url = 'https://www.bobswatches.com/luxury-watches/?p=%s' % (i)
            r = requests.get(url)
            if 'Recently Sold' in r.text:
                break

            soup = BeautifulSoup(r.text, features='html.parser')


            watches = soup.find("div", {"class": "itemResults"}).findAll("div", {"class": "item"})
            added = False
            for watch in watches:
                added = True
                detail = {}
                detail['url'] = watch.find("p", {"class": "itemimage"}).find("a")['href']

                reference_number = False
                description = watch.find("h2").find("span").find("span").getText()

                for s in description.split(" "):
                    if s.isdigit():
                        reference_number = s

                if not reference_number:
                    description = watch.find("h2").getText().strip()


                    j = 0
                    d_split = description.split(" ")
                    for j in range(len(d_split)):
                        if d_split[j] == 'Ref':
                            reference_number = d_split[j+1]

                if reference_number:
                    detail['reference_number'] = reference_number
                    watch_list.append(detail)

            i += 1
        return watch_list


    def getWatchDetails(self, url):
        r = requests.get(url)
        soup = BeautifulSoup(r.text, features='html.parser')

        details = {}

        details['price'] = soup.find("span", {"class": "price"}).getText().strip().replace('$','').replace(',','').replace(' Cash Wire Price','')
        details['condition'] = soup.findAll("td", {"class":"condition"})[1].getText().strip()

        desc_table = soup.find("span", {"itemprop":"description"}).find("table").findAll("td")
        details['brand'] = desc_table[1].getText().strip()
        details['model'] = desc_table[3].getText().strip()
        details['serial_year'] = desc_table[5].getText().strip()

        paper_details = desc_table[17].getText().strip().lower()

        details['papers'] = 'paper' in paper_details
        details['box'] = 'box' in paper_details
        details['manual'] = 'manual' in paper_details
        details['image'] = 'https://www.bobswatches.com/' + soup.find("img", {"class":"photo"})['src']

        return details


#source = BobsWatches()
#print (source.getWatchDetails('https://www.bobswatches.com/rolex-gmt-master-ii-ceramic-116710.html'))

#print (source.getWatches())

