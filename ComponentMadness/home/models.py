from django.db import models
import datetime
from jsonfield import JSONField

from user.models import User
# Create your models here.

class Event(models.Model):
    id = models.AutoField(primary_key=True)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events_host')
    name = models.CharField(max_length=120, blank=True, default="")
    description = models.TextField(blank=True, default="")
    schedule_start_time = models.DateTimeField(null=True)
    length = models.IntegerField(default=30)
    holidays = models.BooleanField(default=False)
    type = models.CharField(default='Book Me', max_length=120)

    def __str__(self):
        return u"{}".format(self.name)

class Invite(models.Model):
    id = models.AutoField(primary_key = True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='invites')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invites')
    going = models.BooleanField(default=False)
    want_to_go = models.BooleanField(default=False)
    read = models.BooleanField(default=False)
    required = models.BooleanField(default=False)
    last_interaction = models.DateTimeField(default=None, null=True, blank=True)

class ScheduleTime(models.Model):
    id = models.AutoField(primary_key=True)
    start_time = models.DateTimeField(null=True)
    end_time = models.DateTimeField(null=True)
    timezone = models.CharField(default='UTC', max_length=120)
    available = models.BooleanField(default=False)
    required = models.BooleanField(default=False)
    repeat_monday = models.BooleanField(default=False)
    repeat_tuesday = models.BooleanField(default=False)
    repeat_wednesday = models.BooleanField(default=False)
    repeat_thursday = models.BooleanField(default=False)
    repeat_friday = models.BooleanField(default=False)
    repeat_saturday = models.BooleanField(default=False)
    repeat_sunday = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scheduled_times')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='scheduled_times')