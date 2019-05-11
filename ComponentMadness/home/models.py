import uuid

from django.db import models
from django_extensions.db.fields import CreationDateTimeField
from django.contrib.postgres.fields import JSONField
from django.utils import timezone

from user.models import User

class CMModel(models.Model):
    class Meta:
        abstract = True
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    GET_STAFF = False
    POST_STAFF = False
    DELETE_STAFF = False

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Watch(CMModel):
    brand = models.CharField(blank=False, default='')
    model = models.CharField(blank=False, default='')
    reference_number = models.CharField(blank=False, default='')

class Source(CMModel):
    name = models.CharField(blank=False, default='')
    last_updated_watch = models.DatetimeField(blank=False, default=timezone.now)
    last_updated_detail = models.DatetimeField(blank=False, default=timezone.now)

class Watch_Instance(CMModel):
    condition = models.CharField(blank=False, default='')
    sold_time = models.DatetimeField(blank=False, default=timezone.now)
    watch = models.ForeignKey(Watch, on_delete=models.CASCADE, related_name='')

class HistoricPrice(CMModel):
    price = models.DecimalField(blank=False, default='')
    watch = models.ForeignKey(Watch, on_delete=models.CASCADE, related_name='')
    watch_instance = models.ForeignKey(Watch_Instance, on_delete=models.CASCADE, related_name='')


