import requests
from bs4 import BeautifulSoup
from home.management.commands.scrapers.basicSpider import BasicSpider


class BobsWatches(BasicSpider):
    def getWatches(self):
        i = 1
        while 1:
            try:
                print(i)
                url = "https://www.bobswatches.com/luxury-watches/?p=%s" % i
                response = requests.get(url)

                soup = BeautifulSoup(response.text, features="html.parser")

                watches = soup.select("div.itemResults div.item")
                if len(watches) == 0:
                    break
                for watch in watches:
                    watch_url = watch.select("p.itemimage a")[0]["href"]
                    reference_number = None
                    description = watch.select("h2 span span")[0].text
                    for s in description.split(" "):
                        if s.isdigit():
                            reference_number = s

                    if not reference_number:
                        description = watch.select("h2")[0].text.strip().lower()
                        description_parts = description.split("ref ")
                        if len(description_parts) > 1:
                            reference_number = description_parts[1].split(" ")[0].split(",")[0]
                            if not reference_number.isdigit():
                                reference_number = None

                    if reference_number:
                        detail = {"url": watch_url,
                                  "reference_number": reference_number}
                        yield detail

                    parents_siblings_class = watch.parent.nextSibling.get("class")
                    if ("Recently Sold" in response.text) and \
                            (parents_siblings_class is None or parents_siblings_class[0] != "itemWrapper"):
                        return

            except Exception as e:
                print(str(e))
                self.sendErrorEmail("Bobs Watches", "getWatches: " + url, str(e))
                yield {"error": True, "error_detail": str(e)}

            i += 1

    def getWatchDetails(self, url):
        response = requests.get(url, allow_redirects=False)

        if response.status_code != 200 or "this item is no longer in stock" in response.text.lower():
            return {"sold": True}

        soup = BeautifulSoup(response.text, features="html.parser")
        watch_div = soup.select("div.watchdetail")[0]
        price = watch_div.select("span.price")[0].text.replace("$", "").replace(",", "").replace(" Cash Wire Price", "")

        conditions = [condition.text.strip().lower() for condition in watch_div.select("td.condition")]
        condition = "New" if len(conditions) > 1 and "unworn" in conditions[1] else "Pre-Owned"

        desc_table = watch_div.select("div.descriptioncontainer span table td")
        model = desc_table[1].text.strip()
        serial_year = desc_table[3].text.strip()

        paper_details = desc_table[15].text.strip().lower()
        papers = "paper" in paper_details or "card" in paper_details
        box = "box" in paper_details
        manual = "manual" in paper_details
        image = "https://www.bobswatches.com/" + watch_div.select("img.photo")[0]["src"]

        details = {"price": price,
                   "condition": condition,
                   "wholesale": False,
                   "model": model,
                   "serial_year": serial_year,
                   "papers": papers,
                   "box": box,
                   "manual": manual,
                   "image": image}

        return details


BobsWatches().do_testing()
