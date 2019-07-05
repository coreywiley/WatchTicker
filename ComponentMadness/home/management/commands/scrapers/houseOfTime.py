import requests
from bs4 import BeautifulSoup
from home.management.commands.scrapers.basicSpider import BasicSpider


class HouseOfTime(BasicSpider):

    def getWatches(self):
        i = 1
        url = ""
        while 1:
            try:
                print(i)
                url = "http://houseoftime1.com/product-category/view-all/page/%s/" % i

                r = requests.get(url)

                soup = BeautifulSoup(r.text, features="html.parser")

                watches = soup.select("div.product")
                if len(watches) == 0:
                    break
                for watch in watches:
                    url = watch.select("a.woocommerce-LoopProduct-link")[0]["href"]
                    reference_number = watch.select("li.reference span.attribute-value")[0].text.strip()

                    detail = {"url": url,
                              "reference_number": reference_number}
                    yield detail

                i += 1
            except Exception as e:
                print(str(e))
                self.sendErrorEmail("House Of Time", "getWatches: " + url, str(e))
                yield {"error": True, "error_detail": str(e)}

    def getWatchDetails(self, url):

        r = requests.get(url)
        if r.status_code == 404:
            return {"sold": True}

        soup = BeautifulSoup(r.text, features="html.parser")

        outer_divs = soup.select("div.product-single")
        if len(outer_divs) == 0:
            return {"sold": True}
        else:
            outer_div = outer_divs[0]

        serial_years = [serial_year.text.strip() for serial_year in
                        outer_div.select("li.serial-year span.attribute-value")]
        serial_year = serial_years[0] if len(serial_years) > 0 else ""

        prices = [price.text.strip().replace("$", "").replace(",", "") for price in
                  outer_div.select("span.woocommerce-Price-amount")]
        price = prices[0] if len(prices) > 0 else ""

        papers = [paper.text.strip().lower() for paper in outer_div.select("li.papers span.attribute-value")]
        paper = papers[0] == "True" or "card" in papers[0] if len(papers) > 0 else False

        images = [image["src"] for image in outer_div.select("img.wp-post-image")]
        image = images[0] if len(images) > 0 else ""

        details = {"price": price,
                   "serial_year": serial_year,
                   "papers": paper,
                   "image": image,
                   "wholesale": True,
                   "condition": "Pre-Owned"}

        return details


HouseOfTime().do_testing()
