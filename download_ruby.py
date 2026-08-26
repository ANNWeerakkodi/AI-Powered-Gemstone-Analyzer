import urllib.request
req = urllib.request.Request('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ruby_gemstone.jpg/512px-Ruby_gemstone.jpg', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response, open('test_ruby.jpg', 'wb') as out_file:
    out_file.write(response.read())
