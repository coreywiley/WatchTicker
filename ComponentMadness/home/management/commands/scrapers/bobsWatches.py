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
                    description = watch.select("h2")[0].text.strip().lower().replace(".", "")
                    description_parts = description.split("ref ")
                    if len(description_parts) > 1:
                        reference_number = description_parts[1].split(" ")[0].split(",")[0]

                    if not reference_number:
                        description = watch.select("h2 span span")[0].text
                        possible_reference = description.split(" ")[-1]
                        if any([ch.isdigit() for ch in possible_reference]) and "mm" not in possible_reference:
                            reference_number = possible_reference

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

        description_dict = {}
        descriptions = watch_div.select("div.descriptioncontainer span table tr")
        for desc in descriptions:
            parts = desc.select("td")
            if len(parts) == 0:
                continue
            key = parts[0].text.split(":")[0].strip().lower()
            val = parts[1].text.split("\n")[0].strip().lower()
            if "model" in key:
                key = "model"
            elif "serial" in key:
                key = "serial_year"
            elif "box" in key and "paper" in key:
                key = "box_and_papers"
            elif "movement" in key:
                key = "manual"
            description_dict[key] = val

        model = description_dict["model"]
        serial_year = description_dict["serial_year"] if "serial_year" in description_dict else ""
        papers = "box_and_papers" in description_dict and \
                 ("paper" in description_dict["box_and_papers"] or "card" in description_dict["box_and_papers"])
        box = "box_and_papers" in description_dict and "box" in description_dict["box_and_papers"]
        manual = "manual" in description_dict["manual"] if "manual" in description_dict else ""
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

