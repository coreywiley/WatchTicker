from django.db import models
import datetime
from jsonfield import JSONField

from user.models import User
# Create your models here.

class Question(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=120, blank=True, default="")
    factoid = models.TextField(blank=True, default="")
    order = models.IntegerField(default=0)
    component = models.CharField(max_length=120, blank=True, default="")
    props = models.TextField(blank=True, default="")
    archived = models.BooleanField(default=True)
    preview_order = models.IntegerField(default=0)
    preview_archived = models.BooleanField(default=True)

    def __str__(self):
        return u"{}".format(self.name)

class Answer(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    answer = models.TextField(blank=True, default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='answers')

class Customize(models.Model):
    id = models.AutoField(primary_key=True)
    skin_color = models.IntegerField(default=0)
    size = models.IntegerField(default=0)
    nipple_color = models.IntegerField(default=0)
    masectomy = models.IntegerField(default=0)
    user = models.IntegerField(default=0)