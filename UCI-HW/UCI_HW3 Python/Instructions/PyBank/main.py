import os
import csv

csvpath1 = 'raw_data/budget_data_1.csv'
csvpath2 = 'raw_data/budget_data_2.csv'

with open(csvpath1, 'r') as csvfile:
    # Split the data on commas
    csvreader = csv.reader(csvfile, delimiter=',')
    next(csvreader)
    # counts up the months
    month = 0
    totalrev = 0
    monthly_change = 0
    monthly_change_sum = 0
    avg_rev_change = 0
    rev_change = []
    rev_array = []
    great_dec = 0
    great_mo = 'string'
    great_inc = 0
    lowest_mo = 'string'

    for row in csvreader:
        revenue = float(row[1])
        rev_array.append(revenue)
        totalrev += revenue
        month += 1
        if revenue < great_dec:
            great_dec = revenue
            great_mo = row[0]
        elif revenue > great_inc:
            great_inc = revenue
            lowest_mo = row[0]

    for i in range(len(rev_array)-1):
        monthly_change = rev_array[i+1]-rev_array[i]
        monthly_change_sum += monthly_change
        rev_change.append(monthly_change)
    avg_rev_change = monthly_change_sum/len(rev_change)

    print ("Total Months: " + str(month) + '\n' + 
        "Total Revenue: " + str(totalrev) + '\n' + 
        "Average Revenue Change: " + str(avg_rev_change) + '\n' + 
        "Greatest Increase in Revenue: " + great_mo + " (" + str(great_inc) + ") " + '\n' + 
        "Greatest Decrease in Revenue: " + lowest_mo + " (" + str(great_dec) + ") ") 
