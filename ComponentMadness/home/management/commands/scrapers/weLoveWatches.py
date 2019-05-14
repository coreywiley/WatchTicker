import pandas as pd

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


            watches.append(watch_detail)
        return watches

    def getWatchDetails(self, stock_num):

        details = {}
        for index, row in self.table.iterrows():
            if row[0] == stock_num:
                details['brand'] = brand_reference_dict.get(row[1], row[1])
                details['reference_number'] = row[2]
                details['papers'] = row[5] in ['PAPER','CARD']
                details['box'] = row[7] == 'BOX'
                try:
                    details['price'] = row[9].replace('$','').replace(',','')
                except:
                    details['price'] = row[9]

        return details

        #table.to_csv("stock_available.csv", index=False)


#source = WeLoveWatches()
#print (source.getWatches())
