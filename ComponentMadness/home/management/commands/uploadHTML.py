from bs4 import BeautifulSoup

from django.core.management.base import BaseCommand, CommandError
from user.models import User
from home.models import *


class Command(BaseCommand):
    def handle(self, *args, **options):
        #self.loadPages()
        self.loadArticles()


    def loadArticles(self):
        Article.objects.all().delete()

        pages = Page.objects
        print ("Existing pages : %s" % (pages.count()))
        article = None
        nextArticle = None
        articleHTML = ""
        articleText = ""
        done = False

        for page in pages.filter().prefetch_related('text').all():
            print ("Working on page : %s" % (page.number))
            parsedHtml = BeautifulSoup(page.text.text, features="html.parser")
            contentDivs = parsedHtml.find('div', attrs={'class': 'pc'}).find_all('div', attrs={'class': 't'})

            for div in contentDivs:
                if str(div) == '<div class="t m1 x26 h20 y882 ff17 fs14 fc0 sc0 ls0 ws0">Chapter 9   T<span class="_ _9"></span>ables</div>':
                    done = True
                    if article:
                        article.endPage = page
                        article.html = LargeText.objects.create(text=articleHTML)
                        article.text = LargeText.objects.create(text=articleText)
                        articleHTML = ""
                        articleText = ""
                        article.save()
                        print ("Saved : %s" % (article.name))

                    break

                if 'h20' in div.get("class") and div.text.startswith('ARTICLE'):
                    if article:
                        article.endPage = page
                        article.html = LargeText.objects.create(text=articleHTML)
                        article.text = LargeText.objects.create(text=articleText)
                        articleHTML = ""
                        articleText = ""
                        article.save()
                        print ("Saved : %s" % (article.name))

                    article = Article.objects.create(name = div.text, startPage = page, endPage = page)

                else:
                    articleHTML += str(div)
                    articleText += div.text

            if done:
                print ("Completed")
                break




    def loadPages(self):
        Page.objects.all().delete()

        file = open('D:\\Elance\\Rogue Tech Team\\70-17SB-PDF.html', 'r', encoding='utf-8')
        html = file.read()
        file.close()

        parsedHtml = BeautifulSoup(html, features="html.parser")
        pages = parsedHtml.body.find_all('div', attrs={'class': 'pf'})
        count = 0
        print (len(pages))
        print ("Existing pages : %s" % (Page.objects.count()))

        for pageString in pages:
            text = LargeText.objects.create(text = str(pageString))
            page = Page.objects.create(number = count, text = text)
            print (str(pageString)[:2000])
            count += 1








