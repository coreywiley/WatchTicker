import requests
from bs4 import BeautifulSoup
from home.management.commands.scrapers.basicSpider import BasicSpider

brand_urls = [
    'https://bonetawholesale.com/SubCategory/AIR-KING/2974',
    'https://bonetawholesale.com/SubCategory/CELLINI/2976',
    'https://bonetawholesale.com/SubCategory/DATE%20LADY/2977',
    'https://bonetawholesale.com/SubCategory/DATE%2034MM/2978',
    'https://bonetawholesale.com/SubCategory/DATEJUST%20LADY%2026MM/2979',
    'https://bonetawholesale.com/SubCategory/DATEJUST%20LADY%2028MM/3463',
    'https://bonetawholesale.com/SubCategory/DATEJUST%2031MM/2980',
    'https://bonetawholesale.com/SubCategory/DATEJUST%2036MM/2981',
    'https://bonetawholesale.com/SubCategory/DATEJUST%2041MM/3465',
    'https://bonetawholesale.com/SubCategory/DATEJUST%20LADY%20PRESIDENT/2983',
    'https://bonetawholesale.com/SubCategory/DATEJUST%20LADY%20PRESIDENT%2028MM/3464',
    'https://bonetawholesale.com/SubCategory/DATEJUST%20MIDSIZE%20PRESIDENT/2984',
    'https://bonetawholesale.com/SubCategory/DAY-DATE%2040MM/3283',
    'https://bonetawholesale.com/SubCategory/DAY-DATE%20PRESIDENT/2985',
    'https://bonetawholesale.com/SubCategory/DAY-DATE%20II%20PRESIDENT/2986',
    'https://bonetawholesale.com/SubCategory/DAYTONA/2987',
    'https://bonetawholesale.com/SubCategory/EXPLORER/2988',
    'https://bonetawholesale.com/SubCategory/EXPLORER%20II/2989',
    'https://bonetawholesale.com/SubCategory/GMT-MASTER%20II/2991',
    'https://bonetawholesale.com/SubCategory/MASTERPIECE%2029MM/2992',
    'https://bonetawholesale.com/SubCategory/MASTERPIECE%2034MM/2993',
    'https://bonetawholesale.com/SubCategory/MASTERPIECE%2039MM/2994',
    'https://bonetawholesale.com/SubCategory/MILGAUSS/2995',
    'https://bonetawholesale.com/SubCategory/OYSTER%20PERPETUAL%2031MM/3285',
    'https://bonetawholesale.com/SubCategory/OYSTER%20PERPETUAL%2034MM/2996',
    'https://bonetawholesale.com/SubCategory/OYSTER%20PERPETUAL%2036MM/3287',
    'https://bonetawholesale.com/SubCategory/OYSTER%20PERPETUAL%2039MM/3288',
    'https://bonetawholesale.com/SubCategory/OYSTERQUARTZ/2997',
    'https://bonetawholesale.com/SubCategory/SKY-DWELLER/3000',
    'https://bonetawholesale.com/SubCategory/SUBMARINER/3001',
    'https://bonetawholesale.com/SubCategory/SUBMARINER%20NO%20DATE/3002',
    'https://bonetawholesale.com/SubCategory/TURN-O-GRAPH/3003',
    'https://bonetawholesale.com/SubCategory/YACHT-MASTER%20LADY/3004',
    'https://bonetawholesale.com/SubCategory/YACHT-MASTER%20MIDSIZE/3005',
    'https://bonetawholesale.com/SubCategory/YACHT-MASTER/3006',
    'https://bonetawholesale.com/SubCategory/YACHT-MASTER%20II/3007',
    'https://bonetawholesale.com/SubCategory/SEA-DWELLER/2998',
    'https://bonetawholesale.com/SubCategory/ALPINA/4354',
    'https://bonetawholesale.com/SubCategory/AUDEMARS%20PIGUET/2914',
    'https://bonetawholesale.com/SubCategory/BAUME%20&%20MERCIER/2917',
    'https://bonetawholesale.com/SubCategory/BELL%20&%20ROSS/2918',
    'https://bonetawholesale.com/SubCategory/BREITLING/2920',
    'https://bonetawholesale.com/SubCategory/BULGARI/2921',
    'https://bonetawholesale.com/SubCategory/CARTIER/2913',
    'https://bonetawholesale.com/SubCategory/CHANEL/2923',
    'https://bonetawholesale.com/SubCategory/CHAUMET/4353',
    'https://bonetawholesale.com/SubCategory/CHOPARD/2924',
    'https://bonetawholesale.com/SubCategory/CHRONOSWISS/2925',
    'https://bonetawholesale.com/SubCategory/CHRISTIAN%20DIOR/3348',
    'https://bonetawholesale.com/SubCategory/CHRISTOPHE%20CLARET/3250',
    'https://bonetawholesale.com/SubCategory/CUERVO%20Y%20SOBRINOS/3367',
    'https://bonetawholesale.com/SubCategory/CORUM/2927',
    'https://bonetawholesale.com/SubCategory/DAVIDOFF/4647',
    'https://bonetawholesale.com/SubCategory/EBEL/2929',
    'https://bonetawholesale.com/SubCategory/EUROPEAN%20COMPANY%20WATCH/4357',
    'https://bonetawholesale.com/SubCategory/FRANCK%20MULLER/2937',
    'https://bonetawholesale.com/SubCategory/GERALD%20GENTA/4359',
    'https://bonetawholesale.com/SubCategory/GIRARD%20PERREGAUX/2938',
    'https://bonetawholesale.com/SubCategory/GRAHAM/2940',
    'https://bonetawholesale.com/SubCategory/GUCCI/2941',
    'https://bonetawholesale.com/SubCategory/HARRY%20WINSTON/2943',
    'https://bonetawholesale.com/SubCategory/HAUTLENCE/4322',
    'https://bonetawholesale.com/SubCategory/HUBLOT/2946',
    'https://bonetawholesale.com/SubCategory/IWC/2947',
    'https://bonetawholesale.com/SubCategory/JACOB%20&%20CO/2948',
    'https://bonetawholesale.com/SubCategory/JAEGER%20LECOULTRE/2949',
    'https://bonetawholesale.com/SubCategory/JORG%20HYSEK/3370',
    'https://bonetawholesale.com/SubCategory/JEAN%20RICHARD/3420',
    'https://bonetawholesale.com/SubCategory/LONGINES/2952',
    'https://bonetawholesale.com/SubCategory/MILUS/4383',
    'https://bonetawholesale.com/SubCategory/MONTBLANC/3215',
    'https://bonetawholesale.com/SubCategory/MAURICE%20LACROIX/3131',
    'https://bonetawholesale.com/SubCategory/OMEGA/2954',
    'https://bonetawholesale.com/SubCategory/PANERAI/2956',
    'https://bonetawholesale.com/SubCategory/PATEK%20PHILIPPE/2957',
    'https://bonetawholesale.com/SubCategory/PARMIGIANI/3227',
    'https://bonetawholesale.com/SubCategory/PERRELET/3246',
    'https://bonetawholesale.com/SubCategory/PAUL%20PICOT/3407',
    'https://bonetawholesale.com/SubCategory/PEQUIGNET/4352',
    'https://bonetawholesale.com/SubCategory/PIAGET/2958',
    'https://bonetawholesale.com/SubCategory/RAYMOND%20WEIL/2959',
    'https://bonetawholesale.com/SubCategory/RICHARD%20MILLE/2960',
    'https://bonetawholesale.com/SubCategory/ROGER%20DUBUIS/3182',
    'https://bonetawholesale.com/SubCategory/TAG%20HEUER/2961',
    'https://bonetawholesale.com/SubCategory/ULYSSE%20NARDIN/2963',
    'https://bonetawholesale.com/SubCategory/VACHERON%20CONSTANTIN/2964',
    'https://bonetawholesale.com/SubCategory/VAN%20CLEEF%20&%20ARPELS/2965',
    'https://bonetawholesale.com/SubCategory/VULCAIN/3875',
    'https://bonetawholesale.com/SubCategory/ZENITH/2966',
    'https://bonetawholesale.com/SubCategory/MISC/3134',
]


class BonetaWholesale(BasicSpider):
    def __init__(self):
        brand_soup = {}
        for url in brand_urls:
            print(url)
            r = requests.get(url)

            soup = BeautifulSoup(r.text, features='html.parser')
            brand_soup[url] = soup
        self.brand_soup = brand_soup

    def getWatches(self):
        for url in brand_urls:
            try:
                soup = self.brand_soup[url]

                watches = soup.findAll("div", {"class": "prod-desc"})

                for watch in watches:
                    details = {}
                    desc_table = watch.findAll("div", {"class": "prd-Desc"})

                    details['brand'] = desc_table[0].getText().strip()
                    details['model'] = desc_table[1].getText().strip()
                    details['reference_number'] = desc_table[2].getText().strip()
                    details['box'] = desc_table[4].getText().strip() == 'YES'
                    details['papers'] = desc_table[5].getText().strip() == "YES"

                    condition = desc_table[6].getText().strip()
                    if condition.lower() == 'unworn':
                        details['condition'] = 'New'
                    else:
                        details['condition'] = 'Pre-Owned'

                    details['price'] = desc_table[11].getText().strip().replace('$', '').replace(',', '')
                    details['url'] = url + '#' + desc_table[8].getText().strip()

                    yield details

            except Exception as e:
                print(str(e))
                self.sendErrorEmail('Boneta Wholesale', 'getWatches: ' + url, str(e))
                yield {'error': True, 'error_detail': str(e)}

    def getWatchDetails(self, url):

        split_url = url.split('#')

        soup = self.brand_soup[split_url[0]]

        watches = soup.findAll("div", {"class": "prod-desc"})

        for watch in watches:

            details = {}
            desc_table = watch.findAll("div", {"class": "prd-Desc"})

            if desc_table[8].getText().strip() == split_url[1]:

                details['brand'] = desc_table[0].getText().strip()
                details['model'] = desc_table[1].getText().strip()
                details['reference_number'] = desc_table[2].getText().strip()
                details['box'] = desc_table[4].getText().strip() == 'YES'
                details['papers'] = desc_table[5].getText().strip() == "YES"
                details['serial_year'] = desc_table[7].getText().strip()

                condition = desc_table[6].getText().strip()
                if condition.lower() == 'unworn':
                    details['condition'] = 'New'
                else:
                    details['condition'] = 'Pre-Owned'

                details['wholesale'] = True

                details['price'] = desc_table[11].getText().strip().replace('$', '').replace(',', '')

                return details

        return {'sold': True}


# brand_urls = brand_urls[:2]
# BonetaWholesale().do_testing()
