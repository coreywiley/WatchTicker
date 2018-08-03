from django.db import models
from jsonfield import JSONField
from django.utils.html import format_html

from django_extensions.db.fields import CreationDateTimeField

from user.models import User
# Create your models here.


class Test(models.Model):
    name = models.CharField(default = "", null = False)


class Question(models.Model):
    test = models.ForeignKey(Test)
    text = models.TextField(default = "", null = False)
    options = models.CharField(default = "", null = False)


class Answer(models.Model):
    question = models.ForeignKey(Question, null = False)
    sid = models.IntegerField(default = 0, null = False)

    text = models.TextField(default = "", null = False)


class Analysis(models.Model):
    answer = models.ForeignKey(Answer, null = False)
    user = models.ForeignKey(User, null = False)

    score = models.CharField(default = "", null = False)



class Comment(models.Model):
    answer = models.ForeignKey(Answer, null = False)
    user = models.ForeignKey(User, null = False)

    text = models.TextField(default = "", null = False)

