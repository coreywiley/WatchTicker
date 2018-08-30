from django.db import models
import datetime
from jsonfield import JSONField

from user.models import User
# Create your models here.


class Page(models.Model):
    name = models.CharField(default = "", max_length=200, null = False)
    number = models.IntegerField(default = 0)

    text = models.TextField(default = "")

    def __str__(self):
        return u"{}".format(self.number)

    class Meta:
        ordering = ['number']


class Tag(models.Model):
    name = models.CharField(default="", max_length=200, null=False)


class Synonym(models.Model):
    name = models.CharField(default="", max_length=200, null=False)

    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name='synonyms')


class Article(models.Model):
    name = models.CharField(default = "", max_length=200, null = False)

    startPage = models.ForeignKey(Page, on_delete=models.CASCADE, blank=False, related_name='articles')
    endPage = models.ForeignKey(Page, on_delete=models.CASCADE, blank=False, related_name='articleEndings')

    text = models.TextField(default = "")

    tags = models.ManyToManyField(Tag, blank=True, related_name='tags')


class Section(models.Model):
    name = models.CharField(default="", max_length=200, null=False)

    text = models.TextField(default = "")


class Search(models.Model):
    query = models.CharField(default="", max_length=200, null=False)

    results = JSONField(blank=True, default=dict())


