import uuid

from django.db import models
from django_extensions.db.fields import CreationDateTimeField
from django.contrib.postgres.fields import JSONField
from django.utils import timezone

from user.models import User
# Create your models here.


class CMModel(models.Model):
    class Meta:
        abstract = True

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    GET_STAFF = False
    POST_STAFF = False
    DELETE_STAFF = False

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ModelConfig(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120, blank=True, default="")
    data = JSONField(default = {})



class Component(models.Model):
    id = models.AutoField(primary_key=True)
    html = models.TextField(blank=True, default="")
    name = models.CharField(max_length=120, blank=True, default="")
    description = models.TextField(blank=True, default="")
    example = models.TextField(blank=True, default="")

    def __str__(self):
        return u"{}".format(self.name)

    def dict(self):
        dict = self.__dict__
        del dict['_state']
        return dict


class ComponentProp(models.Model):
    id = models.AutoField(primary_key=True)
    component = models.ForeignKey(Component, on_delete=models.CASCADE, related_name='componentProps')
    name = models.CharField(max_length=120, blank=True, default="")
    type = models.CharField(max_length=120, blank=True, default="")

    def __str__(self):
        return u"{}".format(self.name)


class ComponentRequirement(models.Model):
    id = models.AutoField(primary_key=True)
    component = models.ForeignKey(Component, on_delete=models.CASCADE, related_name='componentRequirements')
    importStatement = models.TextField(blank=True, default="")

    def __str__(self):
        return u"{}".format(self.importStatement)

class PageGroup(CMModel):
    name = models.CharField(max_length=1200, blank=True, default="")


class Page(models.Model):
    GET_STAFF = False
    POST_STAFF = False
    DELETE_STAFF = False

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=120, blank=True, default="")
    url = models.CharField(max_length=120, blank=True, default="")
    components = models.TextField(default = "[]")
    componentProps = models.TextField(default = "[]")
    pagegroup = models.ForeignKey(PageGroup, default='e10b45fa-e37a-41b5-a003-86728149bc90', on_delete=models.CASCADE, related_name='pages')

    def __str__(self):
        return u"{}".format(self.name)


class PageComponent(models.Model):
    id = models.AutoField(primary_key=True)
    component = models.ForeignKey(Component, on_delete=models.CASCADE, related_name='pageComponents')
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='pageComponents')
    data_url = models.CharField(max_length=120, blank=True, default="")
    data = JSONField(blank=True, default=dict())
    order = models.IntegerField()

    def __str__(self):
        return u"{}".format(self.id)


class Post(models.Model):
    id = models.AutoField(primary_key=True)
    image = models.CharField(max_length=120, blank=True, default="")
    text = models.CharField(max_length=120, blank=True, default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')

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
    model = models.ForeignKey(Model, on_delete=models.CASCADE, null=True, related_name='fields')


class View(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=120, blank=True, default="")
    url = models.CharField(max_length=120, blank=True, default="")
    description = models.CharField(max_length=1200, blank=True, default="")

