from bs4 import BeautifulSoup
from urllib.request import urlopen
import json
from pymongo import MongoClient
from extra_restaurants import insert_camto
from extra_restaurants import insert_sanghai

client = MongoClient('mongodb://localhost')
db = client['newb']
db.categories.drop()
db.cafeterias.drop()

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

insert_camto()
insert_sanghai()

with open('./base.json', 'r') as fp:
    jsonObj = json.load(fp)
    stores = jsonObj['state']['stores']

    for store in stores:
        if not store['name'] in cafts_dict:
            continue
        name = cafts_dict[store['name']]

        key = store['key']
        url = "https://bds.bablabs.com/restaurants/{}?campus_id=JEnfpqCUuR&type=campus".format(key)
        print(url)
        soup = BeautifulSoup(urlopen(url), 'lxml')

        col = db['categories']
        label_wrappers = list(soup.find_all('div', class_='label-wrapper'))
        for lw in label_wrappers:
            child_divs = list(lw.children)

            label_title = list(child_divs[0].children)[-1].get_text()

            card_title = lw.find_all('div', class_='card-title')
            menus = []
            for div in card_title:
                menus.append(div.text)

            col.insert_one({'name': name, 'category': label_title, 'menus': menus})

        col = db['cafeterias']
        info_titles = soup.find_all('div', class_='info-title')

        if info_titles[0].text == '소개':
            descriptions[name] = info_titles[0].next_sibling.text
            # col.insert_one({'name': name, 'description': info_titles[0].next_sibling.text})


    # 학식으로 간주하는 태울관 뚝배기를 위한 부분임. 더럽지만... 귀찮다
    soup = BeautifulSoup(urlopen('https://bds.bablabs.com/restaurants/MjMzNjk1MDU2?campus_id=JEnfpqCUuR'), 'lxml')
    label_wrappers = list(soup.find_all('div', class_='label-wrapper'))
    col = db['categories']
    for lw in label_wrappers:
        child_divs = list(lw.children)

        label_title = list(child_divs[0].children)[-1].get_text()

        card_title = lw.find_all('div', class_='card-title')
        menus = []
        for div in card_title:
            menus.append(div.text)
        col.insert_one({'name': '태울관 뚝배기', 'category': label_title, 'menus': menus})

    col = db['cafeterias']
    # col.insert_one({'name': '태울관 뚝배기', 'description': '태울관에 위치한 태울관 뚝배기입니다.'})

    for store in descriptions:
        col.insert_one({'name': store, 'description': descriptions[store]})
