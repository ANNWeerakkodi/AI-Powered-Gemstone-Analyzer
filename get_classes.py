import urllib.request
from bs4 import BeautifulSoup
import json
import re

url = 'https://www.kaggle.com/datasets/lsind18/gemstones-images'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    # Kaggle stores state in a script tag with class "kaggle-component"
    matches = re.findall(r'\"name\":\"([a-zA-Z0-9\s\'-]+)\"', html)
    # The dataset folder names are in there somewhere.
    # We can also just print all matches and find the contiguous block of 87 gems!
    with open('kaggle.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(matches))
    print("Done")
except Exception as e:
    print(e)
