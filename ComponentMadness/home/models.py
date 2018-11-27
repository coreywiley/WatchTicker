from django.db import models
import datetime
from jsonfield import JSONField

from user.models import User
# Create your models here.

class Question(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=120, blank=True, default="")
    factoid = models.TextField(blank=True, default="")
    order = models.IntegerField(default=1)
    component = models.CharField(max_length=120, blank=True, default="")
    props = models.TextField(blank=True, default="")

    def __str__(self):
        return u"{}".format(self.name)

class Answer(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    answer = models.TextField(blank=True, default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='answers')
