import json
from pymongo import MongoClient

def insert_camto():
    client = MongoClient('mongodb://localhost')
    db = client['newb']
    col = db['categories']

    with open('./camto.json', 'r') as fp:
        jsonObj = json.load(fp)
        categories = jsonObj['categories']

        for obj in categories:
            col.insert_one({'name': '캠토', 'category': obj['category'], 'menus': obj['menu']})


if __name__ == "__main__":
    insert_camto()
