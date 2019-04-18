from django.db import models
import datetime
from jsonfield import JSONField
import uuid
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

