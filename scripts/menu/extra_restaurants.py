"""
this program defines functions for inserting menus
that are not on bablabs. the menus are stored in
./extra_menus.json file.
"""

import json
from pymongo import MongoClient

def insert_camto():
    client = MongoClient('mongodb://localhost')
    db = client['newb']
    col = db['categories']

    with open('./extra_menus.json', 'r') as fp:
        jsonObj = json.load(fp)
        categories = jsonObj['camto']

        for obj in categories:
            col.insert_one({'name': '캠토', 'category': obj['category'], 'menus': obj['menu']})

def insert_sanghai():
    client = MongoClient('mongodb://localhost')
    db = client['newb']
    col = db['categories']

    with open('./extra_menus.json', 'r') as fp:
        jsonObj = json.load(fp)
        categories = jsonObj['sanghai']

        for obj in categories:
            col.insert_one({'name': '상하이', 'category': obj['category'], 'menus': obj['menu']})


if __name__ == "__main__":
    insert_camto()
    insert_sanghai()
