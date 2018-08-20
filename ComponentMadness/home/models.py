from django.db import models, IntegrityError
from jsonfield import JSONField
from django.utils.html import format_html
import random
import string
from django_extensions.db.fields import CreationDateTimeField

from user.models import User
# Create your models here.


class Domain(models.Model):
    id = models.AutoField(primary_key=True)
    domain_name = models.CharField(max_length=1200, blank=True, default="")
    name = models.CharField(max_length=1200, blank=True, default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='domain')

    def __str__(self):
        return u"{}".format(self.name)

class EmojiSlider(models.Model):
    id = models.AutoField(primary_key=True)
    prompt = models.CharField(max_length=120, blank=True, default="")
    progress_bar_color = models.CharField(max_length=120, blank=True, default="")
    background_color = models.CharField(max_length=120, blank=True, default="")
    text_color = models.CharField(max_length=120, blank=True, default="")
    emoji = models.CharField(max_length=240, blank=True, default="")
    domain = models.ForeignKey(Domain, on_delete=models.CASCADE, related_name='emoji_slider')

class SliderAnswers(models.Model):
    id = models.AutoField(primary_key=True)
    ip = models.CharField(max_length=120, blank=True, default="")
    emoji_slider = models.ForeignKey(EmojiSlider, on_delete=models.CASCADE, related_name='slide_answers')
    value = models.IntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True, null=True)

class SliderImpressions(models.Model):
    id = models.AutoField(primary_key=True)
    ip = models.CharField(max_length=120, blank=True, default="")
    emoji_slider = models.ForeignKey(EmojiSlider, on_delete=models.CASCADE, related_name='slide_impressions')
    date = models.DateTimeField(auto_now_add=True, null=True)



