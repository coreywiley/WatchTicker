import requests
from bs4 import BeautifulSoup
import pandas as pd
from selenium import webdriver


def initialize_browser(driver='/Users/JasonKatz/Applications/chromedriver'):
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--disable-extensions')
    chrome_options.add_argument('--profile-directory=Default')
    chrome_options.add_argument("--disable-plugins-discovery")
    chrome_options.add_argument("--start-maximized")
    return webdriver.Chrome(driver, chrome_options=chrome_options)

page = requests.get('https://bonetawholesale.com/SubCategory/ROLEX/2912')

soup = BeautifulSoup(page.text, 'html.parser')
rolex_sub_categories = soup.find_all("ul", {"class": "TreeNodeChild"})[1].find_all("a")

watches_df = pd.DataFrame(columns=["Brand", "Model", "Reference", "Material", "Box", "Papers", "Condition", "Comments",
                                   "Item ID", "Retail", "Discount", "Price", "Status"])

num_sub_categories = len(rolex_sub_categories)
for idx_sub, sub_category in enumerate(rolex_sub_categories):
    website = 'https://bonetawholesale.com' + sub_category.attrs['href']
    page = requests.get(website)
    soup = BeautifulSoup(page.text, 'html.parser')

    num_results = int(soup.find("span", {"id": "lblItemCount"}).text.split()[-1])
    if num_results > 96:
        print("More than 96 watches, using Selenium for {} subcategory".format(sub_category.text))
        driver = initialize_browser()
        if num_results > 576:
            print("**************\nPROBLEM MORE THAN 576 WATCHES\n**************")
        driver.get(website)
        for option in driver.find_element_by_id("ddlPageSize").find_elements_by_tag_name('option'):
            if option.text == '576':
                option.click()
                break
        watch_divs = driver.find_elements_by_class_name("prod-desc")
        num_watches = len(watch_divs)
        for idx_watch, watch in enumerate(watch_divs):
            watch_divs = watch.find_elements_by_css_selector('div')
            watch_info = {}
            for idx, row in enumerate(watch_divs):
                if row.text in watches_df:
                    watch_info[row.text] = watch_divs[idx + 1].text
            watches_df = watches_df.append(watch_info, ignore_index=True)
            if (idx_watch + 1) % 10 == 0:
                print("Finished watch {} of {}".format(idx_watch + 1, num_watches))
        driver.close()

    else:
        mydivs = soup.findAll("div", {"class": "prod-desc"})
        for watch in mydivs:
            watch_divs = watch.findAll("div")
            watch_info = {}
            for idx, row in enumerate(watch_divs):
                if row.text in watches_df:
                    watch_info[row.text] = watch_divs[idx + 1].text
            watches_df = watches_df.append(watch_info, ignore_index=True)
    print("Finished sub category {} of {}".format(idx_sub + 1, num_sub_categories))


watches_df.to_csv("Rolex_Boneta.csv", index=False)
