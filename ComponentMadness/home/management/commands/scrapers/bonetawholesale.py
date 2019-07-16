import requests
from bs4 import BeautifulSoup
from home.management.commands.scrapers.basicSpider import BasicSpider


class BonetaWholesale(BasicSpider):

    @staticmethod
    def get_needed_brand_urls():
        response = requests.get("https://bonetawholesale.com/")
        soup = BeautifulSoup(response.text, "html.parser")
        needed_brand_urls = ["https://bonetawholesale.com" + subcategory["href"].replace(" ", "%20")
                             for subcategory in soup.select("ul.TreeNodeChild li a")]
        return needed_brand_urls

    @staticmethod
    def send_pagination_request(url, page, viewstate):
        headers = {
            "Connection": "keep-alive",
            "Cache-Control": "max-age=0",
            "Origin": "https://bonetawholesale.com",
            "Upgrade-Insecure-Requests": "1",
            "DNT": "1",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/75.0.3770.100 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;"
                      "q=0.8,application/signed-exchange;v=b3",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
        }

        data = [
            ("__EVENTTARGET", "ItemList4$AspNetPager1"),
            ("__EVENTARGUMENT", str(page)),
            ("__VIEWSTATE", viewstate),
            ("__VIEWSTATEENCRYPTED", "")
        ]

        response = requests.post(url, headers=headers, data=data)
        return response

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

    @staticmethod
    def get_next_page_viewstate(soup):
        watch_count_text = soup.select("#lblItemCount")[0].text.strip()
        cur_watch_count = int(watch_count_text.split("-")[1].split(" ")[0].strip())
        max_watch_count = int(watch_count_text.split(" ")[-1].strip())
        if cur_watch_count == max_watch_count:
            return None
        viewstate = soup.select("#__VIEWSTATE")[0]["value"]
        return viewstate

    def getWatches(self):
        brand_urls = self.get_needed_brand_urls()
        for url in brand_urls:
            print(url)
            response = requests.get(url)
            page = 2
            while 1:
                try:
                    soup = BeautifulSoup(response.text, features="html.parser")
                    watches = soup.select("div.prod-desc")
                    for watch in watches:
                        info = self.get_watch_info(url, watch)
                        info.pop("sold")
                        info.pop("wholesale")
                        yield info

                    viewstate = self.get_next_page_viewstate(soup)
                    if not viewstate:
                        break
                    response = self.send_pagination_request(url, page, viewstate)
                    page += 1

                except Exception as e:
                    print(str(e))
                    self.sendErrorEmail("Boneta Wholesale", "getWatches: " + url, str(e))
                    yield {"error": True, "error_detail": str(e)}
                    break

    def getWatchDetails(self, url):
        response = requests.get(url)

        if response.status_code == 404:
            return {"sold": True}

        page = 2
        while 1:
            soup = BeautifulSoup(response.text, features="html.parser")
            watches = soup.select("div.prod-desc")
            for watch in watches:
                info = self.get_watch_info(url, watch)
                if info["url"] == url:
                    info.pop("url")
                    return {"sold": True} if info["sold"] else info

            viewstate = self.get_next_page_viewstate(soup)
            if not viewstate:
                break
            response = self.send_pagination_request(url, page, viewstate)
            page += 1


# BonetaWholesale().do_testing()
