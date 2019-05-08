import pandas as pd

class WeLoveWatches():

    def getWatches(self):
        return []

    def getWatchDetail(self, row):
        return {}

        table = pd.read_html('https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQhzAp8r-Po0KalE6Te3kpZ0ZKByk4LT_cA6PfgESjh6YN5gzW4RpjwrFEhWwZwxBy5CnAJuNZdUCN6/pubhtml?gid=735652720&single=true')[0]

        table.columns = table.iloc[1,:]
        table = table.iloc[3:,3:-1]
        table = table.dropna(how="all")

        table.to_csv("stock_available.csv", index=False)


'''
Reading files
boneta_df = pd.read_csv("Rolex_Boneta.csv")
stock_available_df = pd.read_csv("stock_available.csv")

stock_available_rolex_df = stock_available_df[stock_available_df['Brand'] == "RX"]
stock_available_rolex_df['Brand'] = "ROLEX"
stock_available_rolex_df = stock_available_rolex_df.replace(np.nan, '', regex=True)
boneta_df = boneta_df.replace(np.nan, '', regex=True)

stock_available_rolex_df = stock_available_rolex_df.rename(index=str, columns={"Model": "Reference", 
                                                                               "Paper Status": "Papers", 
                                                                              "BoxStatus" : "Box", 
                                                                              "Wholesale Price USD": "Price"})
                                                                              
for bon_col_name in boneta_df.columns:
    if bon_col_name not in stock_available_rolex_df.columns:
        stock_available_rolex_df[bon_col_name] = ""
for stock_col_name in stock_available_rolex_df.columns:
    if stock_col_name not in boneta_df.columns:
        boneta_df[stock_col_name] = ""
        
full_df = boneta_df.append(stock_available_rolex_df, sort=False)

full_df['Price'].replace('', np.nan, inplace=True)
full_df = full_df.dropna(subset=['Price'])
full_df['Price'] = full_df['Price'].str.replace(',', '')
full_df['Price'] = full_df['Price'].str.replace('$', '')
full_df['Price'] = full_df['Price'].astype(float)

full_df.to_csv("combined_data.csv", index=False)

average_price_by_reference = full_df.groupby('Reference')['Price'].mean().reset_index()
average_price_by_reference.to_csv("average_price_by_reference.csv", index=False)
'''