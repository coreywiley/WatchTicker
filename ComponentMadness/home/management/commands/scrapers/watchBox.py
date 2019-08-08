import requests
from bs4 import BeautifulSoup
from home.management.commands.scrapers.basicSpider import BasicSpider


class WatchBox(BasicSpider):
    main_url = "https://www.thewatchbox.com"

    def get_brand_urls(self):
        url = "https://www.thewatchbox.com/watches/shop/all-watches/"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, features="html.parser")
        brand_urls = [self.main_url + a["href"] for a in soup.select("li a") if
                      a.has_attr("href") and a.parent.has_attr("title") and
                      "/watches/" in a["href"] and "Refine by Brand" in a.parent["title"]]
        return brand_urls

    def getWatches(self):
        for brand_url in self.get_brand_urls():
            try:
                print(brand_url)

                response = requests.get(brand_url)
                bs = BeautifulSoup(response.text, features="html.parser")

                brands = bs.select("span.refinementdisplayValue")
                if len(brands) == 0:
                    print("SKIPPING")
                    continue
                brand = brands[0].text
                print(brand)

                page_urls = bs.select("button.showmorecategorybutton")
                start = 0
                size = 16
                while 1:
                    if len(page_urls) != 0:
                        cur_page_url = "&".join(page_urls[0]["data-url"].split("&")[:-2]) + "&start={}&sz={}".format(start, size)
                        response = requests.get(cur_page_url)
                        bs = BeautifulSoup(response.text, features="html.parser")

                    models = bs.select("div.product-item")
                    if len(models) == 0:
                        break
                    for model in models:
                        model_info = model.select("div.productname a.link")[0]
                        model_name = model_info.text
                        model_url = self.main_url + model_info["href"]
                        model_reference = model.select("div.productid a.link")[0].text
                        details = {"brand": brand,
                                   "model": model_name,
                                   "url": model_url,
                                   "reference_number": model_reference}
                        yield details
                    start += size

                    if len(page_urls) == 0:
                        break

            except Exception as e:
                print(str(e))
                self.sendErrorEmail("Watch Box", "getWatches: " + brand_url, str(e))
                yield {"error": True, "error_detail": str(e)}

    def getWatchDetails(self, url):
        response = requests.get(url)

        if response.status_code == 404:
            return {"sold": True}

        soup = BeautifulSoup(response.text, features="html.parser")

        prices = soup.select("span.value")
        if len(prices) == 0:
            return {"sold": True}
        price = prices[0].text.strip().replace("$", "").replace(",", "")
        about = soup.select("div.content")[1].text.lower()
        condition = "Pre-Owned" if "pre-owned" in about else "New"
        image = soup.select("div.carousel-item img")[0]["src"].replace(" ", "%20")

        description_dict = {}
        descriptions = soup.select("div.propertycontent")
        for description in descriptions:
            key = description.select("span.propertylabel")[0].text.lower()
            value = description.select("span.propertyvalue")[0].text.lower()
            description_dict[key] = value

        box = "box and papers" in description_dict and "no" not in description_dict["box and papers"] and \
              "box" in description_dict["box and papers"]
        papers = "box and papers" in description_dict and "no" not in description_dict["box and papers"] and \
                 "paper" in description_dict["box and papers"]
        manual = "movement" in description_dict and "manual" in description_dict["movement"]

        details = {"papers": papers,
                   "price": price,
                   "box": box,
                   "manual": manual,
                   "condition": condition,
                   "wholesale": False,
                   "image": image}
        return details


WatchBox().do_testing()
