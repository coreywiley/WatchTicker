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
    brand = models.CharField(max_length=1000, blank=False, default='')
    model = models.CharField(max_length=1000, blank=False, default='')
    reference_number = models.CharField(db_index=True, max_length=1000, blank=False, default='')

class Source(CMModel):
    name = models.CharField(max_length=1000, blank=False, default='')
    last_updated_watch = models.DateTimeField(blank=False, default=timezone.now)
    last_updated_detail = models.DateTimeField(blank=False, default=timezone.now)

class Watch_Instance(CMModel):
    price = models.FloatField(blank=False, default=0.0)
    condition = models.CharField(max_length=1000, blank=False, default='')
    sold_time = models.DateTimeField(blank=True, null=True, default=None)
    watch = models.ForeignKey(Watch, on_delete=models.CASCADE, related_name='watch_instances')
    condition = models.CharField(max_length=1000, blank=False, default='')
    box = models.BooleanField(default=False)
    manual = models.BooleanField(default=False)
    papers = models.BooleanField(default=False)
    image = models.CharField(max_length=1000, blank=False, default='')
    source = models.ForeignKey(Source, related_name='watch_instances', on_delete=models.CASCADE, blank=True, null=True)
    url = models.CharField(db_index=True,max_length=1000, blank=False, default='')
    wholesale = models.BooleanField(default=True)

class HistoricPrice(CMModel):
    price = models.FloatField(blank=False, default=0.0)
    watch = models.ForeignKey(Watch, on_delete=models.CASCADE, related_name='historical_prices')
    watch_instance = models.ForeignKey(Watch_Instance, on_delete=models.CASCADE, related_name='historical_prices', db_index=True)


