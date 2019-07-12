import requests
from bs4 import BeautifulSoup
from home.management.commands.scrapers.basicSpider import BasicSpider

not_needed_brand_urls = ['https://bonetawholesale.com/SubCategory/ROLEX/2912',
                         'https://bonetawholesale.com/SubCategory/OYSTER%20PERPETUAL%2026MM/3284',
                         'https://bonetawholesale.com/SubCategory/SEA-DWELLER%20DEEP%20SEA/2999',
                         'https://bonetawholesale.com/SubCategory/BREGUET/2919',
                         'https://bonetawholesale.com/SubCategory/BLANCPAIN/3056',
                         'https://bonetawholesale.com/SubCategory/CARL%20F.%20BUCHERER/3724',
                         'https://bonetawholesale.com/SubCategory/FREDERIQUE%20CONSTANT/3421',
                         'https://bonetawholesale.com/SubCategory/LECOULTRE/2951',
                         'https://bonetawholesale.com/SubCategory/MAITRE%20DU%20TEMPS/4672',
                         'https://bonetawholesale.com/SubCategory/CHOPARD/3340',
                         'https://bonetawholesale.com/SubCategory/GUCCI/3347',
                         'https://bonetawholesale.com/SubCategory/PIAGET/3177',
                         'https://bonetawholesale.com/SubCategory/BULGARI/3178',
                         'https://bonetawholesale.com/SubCategory/POMELLATO/3179',
                         'https://bonetawholesale.com/SubCategory/MISC/3181',
                         'https://bonetawholesale.com/SubCategory/ROBERTO%20COIN/3243',
                         'https://bonetawholesale.com/SubCategory/CARTIER/3241',
                         'https://bonetawholesale.com/SubCategory/DAMIANI/3189']


class BonetaWholesale(BasicSpider):
    @staticmethod
    def get_needed_brand_urls(max_needed_urls):
        response = requests.get("https://bonetawholesale.com/")
        soup = BeautifulSoup(response.text, "html.parser")
        my_brand_urls = ["https://bonetawholesale.com" + subcategory["href"].replace(" ", "%20")
                         for subcategory in soup.select("ul.TreeNodeChild li a")]
        needed_brand_urls = [brand_url for brand_url in my_brand_urls if brand_url not in not_needed_brand_urls]
        if max_needed_urls:
            needed_brand_urls = needed_brand_urls[:max_needed_urls]
        return needed_brand_urls

    @staticmethod
    def get_watch_info(url, watch):
        descriptions = watch.select("div.row")
        description_dict = {}
        for desc in descriptions:
            key = desc.select("div.prd-Info")[0].text.strip()
            val = desc.select("div.prd-Desc")[0].text.strip()
            description_dict[key] = val

        info = {"brand": description_dict["Brand"],
                "model": description_dict["Model"],
                "reference_number": description_dict["Reference"],
                "box": description_dict["Box"] == "YES",
                "papers": description_dict["Papers"] == "YES",
                "condition": "New" if description_dict["Condition"].lower() == "unworn" else "Pre-Owned",
                "price": description_dict["Price"].replace("$", "").replace(",", ""),
                "url": url.split("#")[0] + "#" + description_dict["Item ID"],
                "sold": description_dict["Status"] != "AVAILABLE",
                "wholesale": True}
        return info

    def getWatches(self, max_needed_urls=None):
        brand_urls = self.get_needed_brand_urls(max_needed_urls)
        for url in brand_urls:
            print(url)
            response = requests.get(url)
            soup = BeautifulSoup(response.text, features="html.parser")
            try:
                watches = soup.select("div.prod-desc")
                for watch in watches:
                    info = self.get_watch_info(url, watch)
                    info.pop("sold")
                    info.pop("wholesale")
                    yield info

            except Exception as e:
                print(str(e))
                self.sendErrorEmail("Boneta Wholesale", "getWatches: " + url, str(e))
                yield {"error": True, "error_detail": str(e)}

    def getWatchDetails(self, url):
        response = requests.get(url)
        soup = BeautifulSoup(response.text, features="html.parser")

        watches = soup.select("div.prod-desc")
        for watch in watches:
            info = self.get_watch_info(url, watch)
            if info["url"] == url:
                info.pop("url")
                return {"sold": True} if info["sold"] else info


# BonetaWholesale().do_testing()
