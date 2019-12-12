j# -*- coding: utf-8 -*-
"""
Spyder Editor

@Author: Jonathan Hernandez
"""
import re
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
#import pandas_profiling
import numpy as np

"""Importing the dataset of toll and bridge volume in NYC staring from 2010"""

nyc_traffic_csv = "hourly-traffic-on-metropolitan-transportation-authority-mta-bridges-and-tunnels-beginning-2010.csv"
nyc_traffic_data = pd.read_csv(nyc_traffic_csv)

#print(nyc_traffic_data.shape)
#print(nyc_traffic_data.columns)
#print(nyc_traffic_data.describe())
#print(nyc_traffic_data.dtypes)
#
## Are there any missing values in the dataset
#print(nyc_traffic_data.isnull().sum())
#
#print(nyc_traffic_data.head(n=10))

### Data cleaning

### Replace Plaza Id's with actual bridge/tunnel names
### Per the MTA_Hourly Traffic Bridge Tunnel_Data Dictionary.pdf values

# 1 -11 are the original historical values before tolling switchover dates
# 21 - 30 are the values after the open raad tolling switch over date (around 2017)

nyc_bridges_tolls_names = {1: 'TBX', 2: 'TBM', 3: 'BWB', 4: 'HHB', 5: 'MPB',
                           6: 'CBB', 7: 'QMT', 8: 'HCT', 9: 'TNB', 11: 'VNB',
                           21: 'TBX', 22: 'TBM', 23: 'BWB', 24: 'HHB', 25: 'MPB',
                           26: 'CBB', 27: 'QMT', 28: 'HCT', 29: 'TNB', 30: 'VNB'}


nyc_traffic_data['Plaza ID'] = [nyc_bridges_tolls_names[item] for item in nyc_traffic_data['Plaza ID']]

# Replace the Dates with simply the date only as the time is not needed given 
# the Hour column

# remove the time after "T"
nyc_traffic_data['Date'] = [re.sub('T.*', "", date_time) for date_time in nyc_traffic_data['Date']]

# format the date
nyc_traffic_data['Date'] = pd.to_datetime(nyc_traffic_data['Date'])

# Merge the Hour and date so we can see what hour was the recording of traffic

# Do some plotting
#ez_pass_plot = sns.FacetGrid(nyc_traffic_data, col="Plaza ID", row="Direction")
#ez_pass_plot = ez_pass_plot.map(plt.hist, "# Vehicles - ETC (E-ZPass)")
#ez_pass_plot.savefig("vehicle_frequency_Direction_bridges.jpeg")

# cashless tolling plotting

#cashless_plot = sns.FacetGrid(nyc_traffic_data, col ="Plaza ID", row="Direction")
#cashless_plot = cashless_plot.map(plt.hist, "# Vehicles - Cash/VToll")
#cashless_plot.savefig("cash-less_traffic.jpeg")

# append fsimulated fares (revenue = fare price * volume)
# create simulated fares

""" Around 2010 is when the tolls were about $6.50 USD
As of today (2019), tolls are about $9.50 USD
the rfk bridge was about $13.00 USD"""

vnb = pd.read_csv('vnb_fare_history.csv')
rfk = pd.read_csv('rfk_fare_history.csv')
bwt = pd.read_csv('bwt_fare_history.csv')
qmt = pd.read_csv('qmt_fare_history.csv')
bbt = pd.read_csv('bbt_fare_history.csv')
tnb = pd.read_csv('tnb_fare_history.csv')
vnb = pd.read_csv('vnb_fare_history.csv')

# match the data, make a new column
#print(rfk[["Years", "Toll"]])
#print(vnb[["Years", "Toll"]])
#print(bwt[["Years", "Toll"]])
#print(qmt[["Years", "Toll"]])
#print(bbt[["Years", "Toll"]])
#print(tnb[["Years", "Toll"]])

vnb_after_2010 = vnb[10:]
rfk_after_2010 = vnb[10:]
bwt_after_2010 = vnb[10:]
qmt_after_2010 = vnb[10:]
bbt_after_2010 = vnb[10:]
tnb_after_2010 = vnb[10:]
#print(pandas_profiling.ProfileReport(nyc_traffic_data))

# Empty column
nyc_traffic_data['fare_price'] = ""

# Query to select all rows with hourly results that came from 2010 to 2015 inclusive and not from
# The Verranzo-Narrows Bridge and set the fare_price to 6.50
nyc_traffic_data['year'] = nyc_traffic_data['Date'].dt.year

nyc_traffic_data.loc[(nyc_traffic_data['Plaza ID'] != 'VNB')
                     & (nyc_traffic_data['year'].between(2010, 2014)), 'fare_price'] = 6.50

nyc_traffic_data.loc[(nyc_traffic_data['Plaza ID'] != 'VNB')
                     & (nyc_traffic_data['year'].between(2015, 2016)), 'fare_price'] = 8.00

nyc_traffic_data.loc[(nyc_traffic_data['Plaza ID'] != 'VNB')
                     & (nyc_traffic_data['year'].between(2017, 2019)), 'fare_price'] = 9.50

nyc_traffic_data.loc[(nyc_traffic_data['Plaza ID'] == 'VNB')
                     & (nyc_traffic_data['year'].between(2010, 2014)), 'fare_price'] = 13.00

nyc_traffic_data.loc[(nyc_traffic_data['Plaza ID'] == 'VNB')
                     & (nyc_traffic_data['year'].between(2015, 2016)), 'fare_price'] = 16.00

nyc_traffic_data.loc[(nyc_traffic_data['Plaza ID'] == 'VNB')
                     & (nyc_traffic_data['year'].between(2017, 2019)), 'fare_price'] = 19.00

nyc_traffic_data['revenue'] = nyc_traffic_data['fare_price'] * nyc_traffic_data['# Vehicles - ETC (E-ZPass)']
				
def get_cleaned_data():
	return nyc_traffic_data