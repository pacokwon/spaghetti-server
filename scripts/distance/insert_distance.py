from pymongo import MongoClient
import json

client = MongoClient('mongodb://localhost/')
db = client['newb']
col = db['distances']
db.distances.drop()

with open('dist_data.json', 'r') as fp:
    jsonObj = json.load(fp)
    
    for start in jsonObj:
        for destination in jsonObj[start]:
            col.insert_one({'start': start, 'destination': destination, 'distance': jsonObj[start][destination]})

col = db['places']
db.places.drop()

with open('locations.json', 'r') as fp:
    jsonObj = json.load(fp)

    dests = jsonObj['destination']
    for dest in dests:
        col.insert_one({'name': dest['building'], 'cafeteria_list': dest['cafeteria_list']})

