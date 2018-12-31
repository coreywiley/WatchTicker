from django.db import models
import datetime
from jsonfield import JSONField
import uuid
from user.models import User
# Create your models here.

#use this for ids please id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
# , makes it more secure

class PageComponent(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=120, blank=True, default="")
    data = JSONField(blank=True, default=dict())
    order = models.IntegerField()

    def __str__(self):
        return u"{}".format(self.id)
