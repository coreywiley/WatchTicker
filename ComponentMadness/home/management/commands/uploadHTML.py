from bs4 import BeautifulSoup

from django.core.management.base import BaseCommand, CommandError
from user.models import User
from home.models import *


class Command(BaseCommand):
    def handle(self, *args, **options):
        #self.loadPages()
        #self.loadArticles()
        self.loadChapters()


    def loadChapters(self):
        Chapter.objects.all().delete()

        articles = Article.objects
        print ("Existing articles : %s" % (articles.count()))


        for article in articles.filter().prefetch_related('html').all():
            pages = Page.objects.filter(
                number__gte = article.startPage.number,
                number__lte = article.endPage.number
            ).prefetch_related('text').all()

            articlePrefix = article.name.split(' ')[-1] + "."
            chapter = None
            nextChapter = None
            chapterHTML = ""
            chapterText = ""
            done = False

            print ("Working on article : %s" % (article.name))

            for page in pages:

                print ("Working on page : %s" % (page.number))

                parsedHtml = BeautifulSoup(page.text.text, features="html.parser")
                contentDivs = parsedHtml.find('div', attrs={'class': 'pc'}).find_all('div', attrs={'class': 't'})

                for div in contentDivs:
                    if 'h20' in div.get("class") and div.text.startswith('ARTICLE') and div.text != article.name:
                        done = True
                        break

                    if 'ff17' in div.get("class") and div.text.startswith(articlePrefix):
                        if len(div.text.split(' ')) == 1:
                            continue

                        if chapter:
                            chapter.endPage = page
                            chapter.html = LargeText.objects.create(text=chapterHTML)
                            chapter.text = LargeText.objects.create(text=chapterText)
                            chapterHTML = ""
                            chapterText = ""
                            chapter.save()
                            print ("Saved : %s" % (chapter.name))

                        chapter = Chapter.objects.create(
                            number=div.text.split(" ")[0],
                            name=div.text,
                            article=article,
                            startPage=page,
                            endPage=page
                        )
                        chapterHTML = str(div)
                        chapterText = div.text

                    else:
                        chapterHTML += str(div)
                        chapterText += div.text

                if done:
                    break

            if chapter:
                chapter.endPage = chapter.startPage
                chapter.html = LargeText.objects.create(text=chapterHTML)
                chapter.text = LargeText.objects.create(text=chapterText)
                chapterHTML = ""
                chapterText = ""
                chapter.save()
                print ("Saved : %s :: %s" % (chapter.number, chapter.name))

            print ("Completed")


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

                    article = Article.objects.create(
                        name = div.text,
                        startPage = page,
                        endPage = page
                    )
                    articleHTML = str(div)
                    articleText = div.text

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








