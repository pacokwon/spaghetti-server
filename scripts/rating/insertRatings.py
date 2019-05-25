from pymongo import MongoClient
import pprint
import random

client = MongoClient('mongodb://localhost')
db = client['newb']
db.ratings.drop()

pipeline = [
    {'$unwind': '$menus'},
    {
        '$project': {
            '_id': 1,
            'name': 1,
            'menu': '$menus'
        }
    }
]

res = list(db.categories.aggregate(pipeline))
pprint.pprint(res)

col = db['ratings']
for obj in res:
    for i in range(10):
        if i == 0:
            col.insert_one({'name': obj['name'],
                            'menu': obj['menu'],
                            'rating': [{
                                'taste': random.randint(1, 5),
                                'portion': random.randint(1, 5),
                                'price': random.randint(1, 5)
                            }]})
        else:
            col.update_one(
                {
                    'name': obj['name'],
                    'menu': obj['menu']
                },
                {
                    '$push': {
                        'rating': {
                            'taste': random.randint(1, 5),
                            'portion': random.randint(1, 5),
                            'price': random.randint(1, 5)
                        }
                    }
                }
            )
