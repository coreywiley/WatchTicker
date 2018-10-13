from django.db import models
import datetime
from jsonfield import JSONField

from user.models import User
# Create your models here.


class Business(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, default="")
    address = models.CharField(max_length=255, blank=True, default="")
    street = models.CharField(max_length=255, blank=True, default="")
    street2 = models.CharField(max_length=255, blank=True, default="")
    city = models.CharField(max_length=255, blank=True, default="")
    state = models.CharField(max_length=255, blank=True, default="")
    zipcode = models.CharField(max_length=255, blank=True, default="")
    main_image = models.URLField(blank=True, default="https://groveliving.com/wp-content/uploads/2015/02/Restaurant.jpg")
    description = models.TextField(blank=True, default="")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_businesses')
    published = models.BooleanField(default=False)
    email = models.CharField(max_length=255, blank=True, default="")
    phone = models.CharField(max_length=255, blank=True, default="")
    website = models.URLField(blank=True, default="")
    type = models.CharField(max_length=255, blank=True, default="")
    facebook = models.CharField(max_length=255, blank=True, default="")
    twitter = models.CharField(max_length=255, blank=True, default="")
    instagram = models.CharField(max_length=255, blank=True, default="")
    yelp = models.CharField(max_length=255, blank=True, default="")

class Follow(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follows')
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='follows')
    notifications = models.BooleanField(default=True)

class Deal(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField(blank=True, default="")
    description = models.TextField(blank=True, default="")
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='deals')
    main_image = models.URLField(blank=True, default="http://atlantabeststeamers.com/wp-content/uploads/sites/30/2015/11/hotdeal.png")
    published = models.BooleanField(default=False)
    valid_until = models.DateField(null=True)
    last_published = models.DateTimeField(default = datetime.datetime.now)
    type = models.CharField(max_length=255, blank=True, default="")
    number_of_redeems_available = models.IntegerField(default = 0)

class Redemption(models.Model):
    id = models.AutoField(primary_key=True)
    deal = models.ForeignKey(Deal, on_delete=models.CASCADE, related_name='redemptions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='redemptions')
    date = models.DateField()

