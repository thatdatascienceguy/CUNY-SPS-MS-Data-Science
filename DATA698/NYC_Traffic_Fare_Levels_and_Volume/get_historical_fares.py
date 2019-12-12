#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Nov 17 11:51:23 2019

@author: jonboy1987
"""

import pandas as pd
#print(soup)

# Triboro Bridge both directions Bronx <-> Queens and Bronx <-> Manhattan
rfk_url = "https://en.wikipedia.org/wiki/Triborough_Bridge"

# Bronx Whitestone bridge
bwt_url = "https://en.wikipedia.org/wiki/Bronx%E2%80%93Whitestone_Bridge"
rfk_fare_history = pd.read_html(rfk_url,header=0)
rfk_fare_history[1].to_csv('rfk_fare_history.csv')

bwt_fare_history = pd.read_html(bwt_url,header=0)
bwt_fare_history[1].to_csv('bwt_fare_history.csv')

# Queens Midtown tunnel
qmt_url = "https://en.wikipedia.org/wiki/Queens%E2%80%93Midtown_Tunnel"
qmt_fare_history = pd.read_html(qmt_url,header=0)
qmt_fare_history[1].to_csv('qmt_fare_history.csv')

bbt_url = "https://en.wikipedia.org/wiki/Brooklyn%E2%80%93Battery_Tunnel"
bbt_fare_history = pd.read_html(bbt_url,header=0)
bbt_fare_history[1].to_csv('bbt_fare_history.csv')

tnb_url ="https://en.wikipedia.org/wiki/Throgs_Neck_Bridge"
tnb_fare_history = pd.read_html(tnb_url,header=0)
tnb_fare_history[1].to_csv('tnb_fare_history.csv')

vnb_url = "https://en.wikipedia.org/wiki/Verrazzano-Narrows_Bridge"
vnb_fare_history = pd.read_html(vnb_url,header=0)
vnb_fare_history[1].to_csv('vnb_fare_history.csv')

