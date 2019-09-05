import requests
from bs4 import BeautifulSoup
from home.management.commands.scrapers.basicSpider import BasicSpider


class CrownAndCaliber(BasicSpider):
    def getWatches(self):
        brand_page = requests.get("https://www.crownandcaliber.com/pages/brands")
        brand_soup = BeautifulSoup(brand_page.text, features="html.parser")

        brand_links = brand_soup.select("div.brand-listing a")
        brand_urls = []
        for brand_link in brand_links:
            brand_urls.append([brand_link["href"], brand_link.text.strip()])

        for brand_url in brand_urls:
            try:
                brand = brand_url[1]
                print(brand)
                i = 1
                while 1:
                    print(i)
                    url = "https://www.crownandcaliber.com%s?page=%s" % (brand_url[0], i)
                    response = requests.get(url)

                    soup = BeautifulSoup(response.text, features="html.parser")

                    watches = soup.select("div.itemBox")
                    if len(watches) == 0:
                        break
                    for watch in watches:
                        url = "https://www.crownandcaliber.com" + watch.select("a")[0]["href"]
                        reference_number = watch.select("span.itemSubTitle")[0].text.strip()

                        detail = {"url": url,
                                  "reference_number": watch.select("div.item-barcode")[0].text.strip(),
                                  "model": reference_number,
                                  "brand": brand}
                        yield detail

                    i += 1
            except Exception as e:
                print(str(e))
                self.sendErrorEmail("Crown And Caliber", "getWatches: " + url, str(e))
                yield {"error": True, "error_detail": str(e)}

    def getWatchDetails(self, url):
        response = requests.get(url)

        if response.status_code == 404:
            return {"sold": True}

        soup = BeautifulSoup(response.text, features="html.parser")

        outer_divs = soup.select("div.product-single")
        if len(outer_divs) == 0:
            return {"sold": True}
        else:
            outer_div = outer_divs[0]

        sold = [label.text.lower() for label in soup.select("label.label-newsletter")]
        if len(sold) > 0 and str(sold[:8]) == "sold out":
            return {"sold": True}

        prices = [price.text.strip().replace("$", "").replace(",", "") for price in
                  outer_div.select("span#ProductPrice-product-template")]
        price = prices[0] if len(prices) > 0 else ""
        image = "https:" + outer_div.find("img", {"class": "product-featured-img"})["src"]

        description_dict = {}
        descriptions = outer_div.select("div.more-detail ul li")
        for desc in descriptions:
            parts = desc.select("span")
            if len(parts) == 0:
                continue
            key = parts[0].text.split(":")[0].strip()
            val = parts[1].text.split("\n")[0].strip()
            description_dict[key] = val

        serial_year = description_dict["Approximate Age"] if "Approximate Age" in description_dict else ""
        papers = description_dict["Papers"] == "Yes"
        box = description_dict["Box"] == "Yes"
        manual = description_dict["Manual"] == "Yes"
        condition = "New" if description_dict["Condition"].lower() == "unworn" else "Pre-Owned"

        details = {"papers": papers,
                   "serial_year": serial_year,
                   "price": price,
                   "box": box,
                   "manual": manual,
                   "condition": condition,
                   "wholesale": False,
                   "image": image}

        return details


CrownAndCaliber().do_testing()
