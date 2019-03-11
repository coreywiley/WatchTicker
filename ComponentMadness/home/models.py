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


class Task(CMModel):
    name = models.CharField(max_length=1000)
    expected_pomodoros = models.IntegerField(default = 0)
    pomodoros = models.IntegerField(default = 0)
    parent_task = models.ForeignKey("Task", null=True, on_delete=models.CASCADE, related_name="sub_tasks")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")
    completed = models.BooleanField(default=False)

class Pomodoro(CMModel):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="pomodoro_objects")