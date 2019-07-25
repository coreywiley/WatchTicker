from bs4 import BeautifulSoup
import requests


def get_all_prices():
    prices_url = "https://www.bobswatches.com/pricetable"
    response = requests.get(prices_url, allow_redirects=False)
    soup = BeautifulSoup(response.text, features="html.parser")

    table = soup.select(".watchPriceTable")[0]
    table_headers = table.select("thead tr th")
    keys = [table_header.text.replace("\xa0", " ").strip().replace(" ", "_").lower() for table_header in table_headers]

    table_rows = table.select("tbody tr")
    for table_row in table_rows:
        row_datas = table_row.select("td")
        result = {keys[ind]: row_data.text for ind, row_data in enumerate(row_datas)}
        yield result


all_prices = get_all_prices()
print("\n".join([str(elem) for elem in all_prices]))
