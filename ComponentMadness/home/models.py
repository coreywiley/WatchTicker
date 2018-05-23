from django.db import models
from jsonfield import JSONField
from django.utils.html import format_html

from django_extensions.db.fields import CreationDateTimeField

from user.models import User
# Create your models here.

class Component(models.Model):
    id = models.AutoField(primary_key=True)
    html = models.TextField(blank=True, default="")
    name = models.CharField(max_length=120, blank=True, default="")
    description = models.TextField(blank=True, default="")

    def __str__(self):
        return u"{}".format(self.name)

    def dict(self):
        dict = self.__dict__
        del dict['_state']
        return dict

class ComponentDataField(models.Model):
    id = models.AutoField(primary_key=True)
    component_id = models.ForeignKey(Component, on_delete=models.CASCADE, related_name='componentDataFields')
    name = models.CharField(max_length=120, blank=True, default="")
    html_id = models.CharField(max_length=120, blank=True, default="")
    attribute_to_change = models.CharField(max_length=120, blank=True, default="value")

    def __str__(self):
        return u"{}".format(self.name)

class Page(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=120, blank=True, default="")
    url = models.CharField(max_length=120, blank=True, default="")

    def __str__(self):
        return u"{}".format(self.name)

class PageComponent(models.Model):
    id = models.AutoField(primary_key=True)
    component_id = models.ForeignKey(Component, on_delete=models.CASCADE, related_name='pageComponent')
    page_id = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='pageComponent')
    data_url = models.CharField(max_length=120, blank=True, default="")
    data = JSONField(blank=True,default=dict())
    order = models.IntegerField()

    def __str__(self):
        return u"{}".format(self.id)


class User(models.Model):
    id = models.AutoField(primary_key=True)
    image = models.CharField(max_length=120, blank=True, default="")
    name = models.CharField(max_length=120, blank=True, default="")

    def __str__(self):
        return u"{}".format(self.name)

class Post(models.Model):
    id = models.AutoField(primary_key=True)
    image = models.CharField(max_length=120, blank=True, default="")
    text = models.CharField(max_length=120, blank=True, default="")
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post')

    def __str__(self):
        return u"{}".format(self.id)

class Model(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=120, blank=True, default="")

class Field(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=120, blank=True, default="")
    fieldType = models.CharField(max_length=120, blank=True, default="")
    default = models.CharField(max_length=120, blank=True, default="")
    blank = models.BooleanField()
    model = models.ForeignKey(Model, on_delete=models.CASCADE, null=True, related_name='field')

class View(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=120, blank=True, default="")
    url = models.CharField(max_length=120, blank=True, default="")
    description = models.CharField(max_length=1200, blank=True, default="")

