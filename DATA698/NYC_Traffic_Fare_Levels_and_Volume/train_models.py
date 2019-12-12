#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Dec  1 01:37:45 2019

@author: jonboy1987
"""

import numpy as np
from sklearn import linear_model
from sklearn.model_selection import train_test_split
from sklearn import preprocessing
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from get_and_clean_data import get_cleaned_data

# get cleaned data
nyc_traffic_data_cleaned = get_cleaned_data()

encoder = preprocessing.LabelEncoder()
nyc_traffic_data_cleaned["Plaza ID"] = encoder.fit_transform(nyc_traffic_data_cleaned["Plaza ID"])
nyc_traffic_data_cleaned["Direction"] = encoder.fit_transform(nyc_traffic_data_cleaned["Direction"])

# explanatory variables
data = nyc_traffic_data_cleaned[["Plaza ID", "Hour", "year",
   "Direction", "fare_price"]]

# response variable
y = nyc_traffic_data_cleaned["# Vehicles - ETC (E-ZPass)"]

# training and test split
X_train, X_test, y_train, y_test = train_test_split(data, y, test_size = 0.3)

# fit a linear model to start off

# do some preprocessing, replace the string variables temporary
# with the string variables Direction and Plaza ID

lm_fare_price = linear_model.LinearRegression()
model = lm_fare_price.fit(X_train,y_train)
predictions = lm_fare_price.predict(X_test)

print(r2_score(y_test, predictions))

# Elastic net regularization model using alpha = 1 and L1 and L2 to be .5
en_fare_price = linear_model.ElasticNet(alpha=1.0, l1_ratio=0.5)
en_model = en_fare_price.fit(X_train, y_train)
en_predictions = en_model.predict(X_test)

print("( %d, %d) " % (max(en_predictions), min(en_predictions)))
print("( %d, %d) " % (max(predictions), min(predictions)))

# Bread and butter basic multiple linear regression shows predicted prices to be
# about $4 dollars to $44 dollars.

# Random forest model

rf_fare_price = RandomForestRegressor(n_estimators = 100)
rf_fare_price.fit(X_train, y_train)
rf_predictions = rf_fare_price.predict(X_test)
print(rf_predictions)

rf_errors = abs(rf_predictions - y_test)
print(rf_errors)
print('Mean Absolute Error:', round(np.mean(rf_errors), 2))

print("( %d, %d) " % (max(rf_predictions), min(rf_predictions)))
rf_importances = list(rf_fare_price.feature_importances_)
print(rf_importances)
feature_importances = [(feature, round(importance, 2)) for feature, importance in zip(nyc_traffic_data_cleaned.columns, rf_importances)]
[print('Feature: {:10} Importance: {}'.format(*pair)) for pair in feature_importances]
