import pandas as pd
from home.management.commands.scrapers.basicSpider import BasicSpider

brand_reference_dict = {
    "AP": "Audemars Piguet",
    "BR": "Breitling",
    "CR": "Cartier Watch",
    "HU": "Hublot",
    "IWC": "IWC",
    "LS": "A. Lange & Sohne",
    "OM": "Omega",
    "OP": "Panerai",
    "PP": "Patek Philippe",
    "RX": "Rolex",
    "TH": "Tag Heuer",
}


class WeLoveWatches(BasicSpider):
    def __init__(self):
        table = pd.read_html("https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQhzAp8r-Po0KalE6Te3kpZ0ZKByk4LT_c"
                             "A6PfgESjh6YN5gzW4RpjwrFEhWwZwxBy5CnAJuNZdUCN6/pubhtml?gid=735652720&single=true")[0]
        table.columns = table.iloc[1, :]
        table = table.iloc[3:, 3:-1]
        table = table.dropna(how="all")

        self.table = table

    def getWatches(self):
        for index, row in self.table.iterrows():
            brand = brand_reference_dict[row[1]] if row[1] in brand_reference_dict else ""
            reference_number = row[2]
            url = row[0]
            watch_detail = {"brand": brand,
                            "reference_number": reference_number,
                            "url": url}
            
            yield watch_detail

    def getWatchDetails(self, stock_num):
        for index, row in self.table.iterrows():
            if row[0] == stock_num:
                price = str(row[9]).replace("$", "").replace(",", "")
                details = {"brand": brand_reference_dict.get(row[1], row[1]),
                           "reference_number": row[2],
                           "serial_year": row[3],
                           "papers": row[5] in ["PAPER", "CARD"],
                           "box": row[7] == "BOX",
                           "wholesale": True,
                           "condition": "Pre-Owned",
                           "price": price}
                return details

        return {"sold": True}


WeLoveWatches().do_testing()
