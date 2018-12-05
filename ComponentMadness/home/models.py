from django.db import models
import datetime
from jsonfield import JSONField

from user.models import User
# Create your models here.

class Question(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=1200, blank=True, default="")
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

class Journal(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField(default=datetime.datetime.now)
    notes = models.TextField(default='')
    user = models.IntegerField(default=0)

class Symptom(models.Model):
    id = models.AutoField(primary_key=True)
    journal = models.ForeignKey(Journal, on_delete=models.CASCADE, related_name='symptoms')
    x_coord = models.IntegerField(default=0)
    y_coord = models.IntegerField(default=0)
    symptom = models.CharField(max_length=120, blank=False, default="")

class Doctor(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=1200, blank=True, default = "")
    type = models.CharField(max_length=120, blank=True, default = "")
    phone = models.CharField(max_length=120, blank=True, default="")
    email = models.CharField(max_length=120, blank=True, default="")
    notes = models.TextField(blank=True, default="")
    next_appointment = models.DateField(null=True)
    reminder = models.BooleanField(default=False)
    user = models.IntegerField(default=0)

class FAQ(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.CharField(max_length=1200, blank=True, default="")
    answer = models.TextField(blank=True, default="")
    order = models.IntegerField(default=0)
    archived = models.BooleanField(default=True)
    preview_order = models.IntegerField(default=0)
    preview_archived = models.BooleanField(default=True)

    def __str__(self):
        return u"{}".format(self.question)
