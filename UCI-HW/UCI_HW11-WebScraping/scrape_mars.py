import time
from splinter import Browser
from bs4 import BeautifulSoup as bs
import pandas as pd
from selenium import webdriver
import numpy as np
import re


def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {"executable_path": "chromedriver"}
    browser = Browser("chrome", **executable_path, headless=True)
    return browser


def scrape():
    browser = init_browser()
    mars = {}
    ########################################################
    # NASA MARS NEWS
    ########################################################

    url = 'https://mars.nasa.gov/news/'
    browser.visit(url)
    html = browser.html
    soup = bs(html, 'html.parser')
    titles = soup.find_all('div', class_='bottom_gradient')
    paras = soup.find_all('div', class_='article_teaser_body')
    nasa_articles = {}
    news_p = []
    news_title = []

    for i in np.arange(len(titles)):
        # append to list
        news_title.append(titles[i].text.replace('\n',''))
        news_p.append(paras[i].text.replace('\n',''))
    
    # append to dataframe
    mars['news_title'] = news_title
    mars['news_p'] = news_p

    ########################################################
    # JPL MARS SPACE IMAGES - FEATURED IMAGES
    ########################################################

    url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(url)
    html = browser.html
    soup = bs(html, 'html.parser')
    
    # check find method -- it will list the most current image by date
    current_date = soup.find('h3', class_="release_date")
    current_image = soup.find('div', class_="img")
    mars['current_image_date'] = current_date.text
    
    imgext = current_image.img['src']
    image_url = 'https://www.jpl.nasa.gov'+imgext 
    print(image_url)

    all_imgs = soup.find_all('a', class_="fancybox")
    all_imgs

    # largest image is posted after the 1st class -- isolating the url
    i = 0
    while True:
        if len(all_imgs[i]['class'])==1:
            rsc = all_imgs[i]['data-fancybox-href']
            break
        else:
            i += 1
            continue

    mars['featured_image_url'] = 'https://www.jpl.nasa.gov'+rsc

    # ########################################################
    # # MARS WEATHER
    # ########################################################
    url = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(url)
    html = browser.html
    soup = bs(html, 'html.parser')

    tweets = soup.find_all('p', class_='TweetTextSize TweetTextSize--normal js-tweet-text tweet-text')
    tweets_list = list(tweets)
    # largest image is posted after the 1st class -- isolating the url
    i = 0
    while True:
        for text in tweets_list[i].text.split():
            if text != 'Sol':
                print('*',end='')
            elif text == 'Sol':
                print(i)
                break
        if text == 'Sol':
            break
        else:
            i += 1
    mars['mars_weather'] = tweets[i].text
    # mars['mars_weather'] = list(tweets[i].text.split(','))
    # return mars

    # ########################################################
    # # MARS FACTS
    # ########################################################

    url = 'https://space-facts.com/mars/'
    tables = pd.read_html(url)
    tables = tables[0].rename(columns={0:'',1:'Values'})
    tables = tables.set_index('',drop=True)
    tables = tables.to_html()

    mars['mars_html_table'] = tables

    # ########################################################
    # # MARS HEMISPHERE
    # ########################################################


    url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(url)
    html = browser.html
    soup = bs(html, 'html.parser')

    titles = soup.find_all('h3')
    title =[]
    for name in titles:
        print(name.text)

    links = soup.find_all('a', class_='itemLink product-item')

    img_link = []
    urls = []
    for i in np.arange(len(links)):
        if i == 0:
            img_link.append('https://astrogeology.usgs.gov'+links[i]['href'])
        elif (links[i]['href'])==(links[i-1]['href']):
            print('*', end='', flush=True)
        else:
            img_link.append('https://astrogeology.usgs.gov'+links[i]['href'])
    
    img_url = []
    for i in np.arange(len(img_link)):
        url = img_link[i]
        executable_path = {"executable_path": "chromedriver"}
        browser = Browser("chrome", **executable_path, headless=True)

        browser.visit(url)
        html = browser.html
        soup = bs(html, 'html.parser')
        img_url.append(soup.find('a',target='_blank'))

    img_url
    hemisphere_image_urls = []
    for i in np.arange(len(img_url)):
        hemisphere_image_urls.append({'title': titles[i].text, 'img_url':img_url[i]['href']})

    mars['hemisphere_image_urls'] = hemisphere_image_urls

    return mars











    
    # browser = init_browser()
    # # create surf_data dict that we can insert into mongo
    # surf_data = {}

    # # visit unsplash.com
    # unsplash = "https://www.unsplash.com"
    # browser.visit(unsplash)

    # # search for surfing
    # browser.fill("searchKeyword", "surfing")

    # # find button and click it to search
    # button = browser.find_by_name("button")
    # button.click()
    # time.sleep(2)
    # html = browser.html
    # # create a soup object from the html
    # img_soup = BeautifulSoup(html, "html.parser")
    # elem = img_soup.find(id="gridMulti")
    # img_src = elem.find("img")["src"]

    # time.sleep(2)
    # # add our src to surf data with a key of src
    # surf_data["src"] = img_src
    # # visit surfline to get weather report
    # weather = "http://www.surfline.com/surf-forecasts/southern-california/santa-barbara_2141"
    # browser.visit(weather)
    # # grab our new html from surfline
    # html = browser.html
    # # create soup object from html
    # forecast_soup = BeautifulSoup(html, "html.parser")
    # report = forecast_soup.find(class_="forecast-outlook")
    # surf_report = report.find_all("p")
    # # add it to our surf data dict
    # surf_data["report"] = build_report(surf_report)
    # # return our surf data dict
    # return surf_data


# # helper function to build surf report
# def build_report(surf_report):
#     final_report = ""
#     for p in surf_report:
#         final_report += " " + p.get_text()
#         print(final_report)
#     return final_report
