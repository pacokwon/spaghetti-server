from bs4 import BeautifulSoup
from extra_restaurants import insert_camto
from extra_restaurants import insert_sanghai
from pymongo import MongoClient
from random import randint
from urllib.request import urlopen
import json

client = MongoClient('mongodb://localhost')
db = client['newb']

# initialize collections
db.categories.drop()
db.cafeterias.drop()

# this dictionary is used for converting bablab's version of names of restaurants
# to mink's(this project's) version of names of restaurants
cafts_dict = {
    "뚝배기": "뚝배기",
    "오니기리와이규동(카이스트점)": "오니기리와 이규동",
    "롯데리아(카이스트점)": "롯데리아",
    "풀빛마루": "풀빛마루",
    "옥라면(동측라면)": "옥라면",
    "대덕동네피자": "대덕동네피자",
    "HUE 김밥": "휴김밥",
    "서브웨이": "서브웨이"
}

# this dictionary gives predefined descriptions for restaurants that do not have
# descriptions or for those that are not displayed on bablab
descriptions = {
    "뚝배기": "카이마루에 위치한 뚝배기입니다. 제육볶음, 참치회덮밥 등을 판매합니다",
    "오니기리와 이규동": "",
    "롯데리아": "",
    "풀빛마루": "",
    "옥라면": "",
    "대덕동네피자": "",
    "휴김밥": "",
    "서브웨이": "",
    "상하이": "카이마루에 위치한 중식 음식점 상하이입니다.",
    "태울관 뚝배기": "태울관에 위치한 태울관 뚝배기입니다.",
    "캠토": '카이마루에 위치한 토스트, 컵밥 판매 매점입니다'
}

# because camto nor sanghai are featured in bablab they are inserted manually,
# refer to the origin of these functions for further detail
insert_camto()
insert_sanghai()

# base.json is made from get_base_data.py
with open('./base.json', 'r', encoding='utf-8') as fp:
    jsonObj = json.load(fp)

    # this array has dictionaries that contain informations about each store
    stores = jsonObj['state']['stores']

    # traverse each store information dictionary
    for store in stores:
        if not store['name'] in cafts_dict:
            continue
        name = cafts_dict[store['name']]

        # key stores specific code for the url of the corresponding store.
        key = store['key']
        # insert the code to the url to get the html source of that store
        url = "https://bds.bablabs.com/restaurants/{}?campus_id=JEnfpqCUuR&type=campus".format(key)
        print(url)
        soup = BeautifulSoup(urlopen(url), 'lxml')

        col = db['categories']
        # just some complicated but useless piece of code that gets the names of menus
        label_wrappers = list(soup.find_all('div', class_='label-wrapper'))

        # each label wrapper contains categories of menus. traverse each category
        for lw in label_wrappers:
            child_divs = list(lw.children)

            label_title = list(child_divs[0].children)[-1].get_text()

            card_title = lw.find_all('div', class_='card-title')
            menus = []
            for div in card_title:
                menus.append(div.text)

            col.insert_one({'name': name, 'category': label_title, 'menus': menus})

        # get description for cafeteria
        col = db['cafeterias']
        info_titles = soup.find_all('div', class_='info-title')

        # if description exists, add it to the dictionary
        if info_titles[0].text == '소개':
            descriptions[name] = info_titles[0].next_sibling.text


    # 학식으로 간주하는 태울관 뚝배기를 위한 부분임. 더럽지만... 귀찮다
    soup = BeautifulSoup(urlopen('https://bds.bablabs.com/restaurants/MjMzNjk1MDU2?campus_id=JEnfpqCUuR'), 'lxml')
    label_wrappers = list(soup.find_all('div', class_='label-wrapper'))
    col = db['categories']
    for lw in label_wrappers:
        child_divs = list(lw.children)

        label_title = list(child_divs[0].children)[-1].get_text()

        card_title = lw.find_all('div', class_='card-title')
        menus = set()
        for div in card_title:
            menus.add(div.text)
        col.insert_one({'name': '태울관 뚝배기', 'category': label_title, 'menus': list(menus)})

    col = db['cafeterias']

    for store in descriptions:
        col.insert_one({'name': store,
                        'description': descriptions[store],
                        'rating': [randint(1, 5) for i in range(10)]
                        })
