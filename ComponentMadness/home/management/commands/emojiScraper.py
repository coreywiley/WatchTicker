from bs4 import BeautifulSoup
import requests
import pickle


def cssFile():
    emojis = getEmojis()
    emojiClasses = []
    with open('emojis.css','w') as file:
        for emoji in emojis:
            className = emoji[0][1:-1]
            if className not in emojiClasses:

                emojiClasses.append(className)

                title = className.replace('-',' ').title()
                content = emoji[2].replace('U+',"\\0")

                cssString = "." + className + "::before { content:'" + content + "'; }\n"
                file.write(cssString)

def optionsFile():
    emojis = getEmojis()
    emojiClasses = []
    with open('emojiOptions.txt','w') as file:
        for emoji in emojis:
            className = emoji[0][1:-1]
            if className not in emojiClasses:

                emojiClasses.append(className)

                title = className.replace('-',' ').title()
                content = emoji[2].replace('U+',"\\0")

                optionString = "{'text':'" + title + "','value':'" + className + "'},\n"
                file.write(optionString)

def getEmojis():
    emojis = pickle.load(open('emojiTags.p','rb'))
    return emojis

def scrape():
    urls = ['https://emojipedia.org/people/',
            'https://emojipedia.org/nature/',
            'https://emojipedia.org/food-drink/',
            'https://emojipedia.org/activity/',
            'https://emojipedia.org/travel-places/',
            'https://emojipedia.org/objects/',
            'https://emojipedia.org/symbols/',
            'https://emojipedia.org/flags/']

    emojiUrls = []
    for url in urls:
        r = requests.get(url)
        #print (r.text)

        soup = BeautifulSoup(r.text, "html.parser")

        emojiList = soup.findAll('ul',{"class":"emoji-list"})
        #print (emojiList)
        emojis = emojiList[0].findAll('a')
        for emoji in emojis:
            emojiUrls.append(emoji['href'])

    emojiTags = []
    for emojiUrl in emojiUrls:
        emojiRequestUrl = 'https://emojipedia.org' + emojiUrl
        print (emojiUrl)
        emojiRequest = requests.get(emojiRequestUrl)
        emojiSoup = BeautifulSoup(emojiRequest.text, "html.parser")

        aTags = emojiSoup.findAll('a')


        for a in aTags:
            text = a.getText()
            href = a['href']
            if 'U+' in text:
                emojiTags.append([emojiUrl, emojiRequestUrl, text[2:]])

    pickle.dump(emojiTags, open('emojiTags.p','wb'))



optionsFile()









