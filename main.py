from bs4 import BeautifulSoup as bs
import requests as req
import re as rgx
from os import path, mkdir

LINKS_LIST = [
    "https://spiewnik.wywrota.pl/kancelarya/zabiore-cie-wlasnie-tam",
    "https://spiewnik.wywrota.pl/piosenki-ludowe/lipka-z-tamtej-strony-jeziora",
    "https://spiewnik.wywrota.pl/mechanicy-shanty/bitwa/40916",
    "https://spiewnik.wywrota.pl/kobranocka/kocham-cie-jak-irlandie",
]
import json
DATA = {}
err = open("fuckup.txt", "w+")

def scrapToFile(link):
    r = req.get(link)
    html = bs(r.content, features="html.parser")
    try:
        h1 = html.select("section>.container h1")[0]
        # print({'h1': h1})
        title = h1.find("strong").text
    except IndexError as e:
        print("Nie udało się przy:", link, e.args)
        err.write(link + '\m')
        return 0
    # # print({'c':h1.text})
    # # print(h1.text)
    author = rgx.findall('\n\s+([\w\W]+)\n', h1.text)
    comment = html.find('div', {'class': 'song-metadata mb-3 text-muted'}).text
    capo = rgx.findall('Kapodaster:\W+([\w ó]+\w)', comment)
    txt= html.find('div', {"class":"interpretation-content"})
    # print({'comment': capo})

    txt = rgx.sub(r'<code class="an" data-chord="\w" data-local="\w?" data-suffix=".?">([\w\d+ ]{1,4})</code>', r'[\1]', str(txt))
    txt = rgx.sub(r'<span class="text-muted">?([\w\dĄĆĘŁŃÓŚŹŻąćęłńóśźż;:\., ]+)</span>', r'{\1}', str(txt))
    txt = rgx.sub(r' ]', r']', str(txt))
    txt = bs(txt, features="html.parser").text
    # print(txt)

    author = rgx.sub(r'[\n ]+', ' ', author[0])

    dir = 'texts/'+author+'/'
    try:
        DATA[author]
    except KeyError:
        DATA[author] = []

    DATA[author].append(title)
    # return
    # print(DATA)

    if not path.exists(dir):
        mkdir(dir)

    with open(dir+title+".md", "w+", encoding="utf-8") as file:
        file.write("# " + title + '\n')
        file.write("## " + author + '\n')
        try:
            file.write("> Kapodaster: " + capo[0] + '\n')
        except IndexError:
            pass
        file.write('\n\n')
        file.write(txt)

with open("links.txt", 'r') as f:
    for link in f.readlines():
        try:
            scrapToFile(link.removesuffix('\n'))
        except KeyboardInterrupt:
            break

with open("data.json", 'w', encoding="utf-8") as f:
    json.dump(DATA, f, ensure_ascii=False)