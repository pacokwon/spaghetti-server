"""
This python file updates json files
"""
import json
import re
from bs4 import BeautifulSoup
from urllib.request import urlopen

if __name__ == "__main__":
    page = urlopen("https://bds.bablabs.com/restaurants?campus_id=JEnfpqCUuR&type=campus")
    soup = BeautifulSoup(page, 'lxml')

    scripts = soup.find_all("script")               # 모든 script tag를 찾는다
    pattern = re.compile("window.__NUXT__=(.*?);")  # JSON이 이 안에 담겨있다.
    for script in scripts: # script tag를 돌아다니면서 regex match를 찾는다
        if pattern.match(str(script.string)):
            # groups() returns a tuple of strings.
            link_json = json.loads(pattern.match(str(script.string)).groups()[0])

            # save json file
            with open('base.json', 'w') as outfile:
                json.dump(link_json, outfile, indent=4)
            break
