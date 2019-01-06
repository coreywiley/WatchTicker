from django.db import models
import datetime
from jsonfield import JSONField
import uuid
from user.models import User
# Create your models here.

'''
much more secure

class ExampleModel(models.Model):
    GET_STAFF = False
    POST_STAFF = False
    DELETE_STAFF = False
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

'''

class PageComponent(models.Model):
    GET_STAFF = False
    POST_STAFF = False
    DELETE_STAFF = False

    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=120, blank=True, default="")
    data = JSONField(blank=True, default=dict())
    order = models.IntegerField()

    def __str__(self):
        return u"{}".format(self.id)


class TestData(models.Model):
    GET_STAFF = True
    POST_STAFF = False
    DELETE_STAFF = False

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='testdata')