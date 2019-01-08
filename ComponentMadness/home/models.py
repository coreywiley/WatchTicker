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


