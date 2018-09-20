from django.db import models
import datetime
from user.models import User
# Create your models here.


class Customer(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(default = "", max_length=200, null = False)
    address = models.CharField(default="", max_length=200, null=False)
    city = models.CharField(default="", max_length=200, null=False)
    state = models.CharField(default="", max_length=200, null=False)
    zip = models.CharField(default="", max_length=200, null=False)
    phone = models.CharField(default = "", max_length=200, null = False)
    email = models.CharField(default = "", max_length=200, null = False)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='customers')
    notes = models.TextField(default="", null=False)

    def __str__(self):
        return u"{}".format(self.name)

class FoodItem(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, null = False)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE, related_name='food_items')

class Event(models.Model):
    id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customer, null = False, on_delete=models.CASCADE, related_name='events')
    name = models.TextField(default = "", null = False)
    date = models.CharField(default = datetime.datetime.now, max_length=200)
    leave_time = models.CharField(default = datetime.datetime.now,  max_length=200)
    arrival_time = models.CharField(default = datetime.datetime.now,  max_length=200)
    address = models.CharField(default="", max_length=200, null=False)
    city = models.CharField(default="", max_length=200, null=False)
    state = models.CharField(default="", max_length=200, null=False)
    zip = models.CharField(default="", max_length=200, null=False)
    occasion = models.CharField(default = "", max_length=200, null = False)
    guest_count = models.IntegerField(default = 0, null = False)
    contact_info = models.CharField(default = "", max_length=200, null = False)
    user = models.ForeignKey(User, null = True, on_delete=models.CASCADE, related_name='events')
    notes = models.TextField(default = "", null = False)

    def __str__(self):
        return u"{}".format(self.name)

class Order(models.Model):
    id = models.AutoField(primary_key=True)
    event = models.ForeignKey(Event, null = False, on_delete=models.CASCADE, related_name='orders')
    food_item = models.ForeignKey(FoodItem, null = False, on_delete=models.CASCADE, related_name='orders')
    quantity = models.IntegerField(default = 0, null = False)

class ShoppingListItem(models.Model):
    id = models.AutoField(primary_key=True)
    task = models.TextField(default = "", null = False)
    food_item = models.ForeignKey(FoodItem, null = False, on_delete=models.CASCADE, related_name='shopping_list')

    def __str__(self):
        return u"{}".format(self.task)

class PrepListItem(models.Model):
    id = models.AutoField(primary_key=True)
    task = models.TextField(default="", null=False)
    food_item = models.ForeignKey(FoodItem, null=False, on_delete=models.CASCADE, related_name='prep_list')

    def __str__(self):
        return u"{}".format(self.task)

class DecorationListItem(models.Model):
    id = models.AutoField(primary_key=True)
    task = models.TextField(default="", null=False)
    food_item = models.ForeignKey(FoodItem, null=False, on_delete=models.CASCADE, related_name='decoration_list')

    def __str__(self):
        return u"{}".format(self.task)

class PackingListItem(models.Model):
    id = models.AutoField(primary_key=True)
    task = models.TextField(default="", null=False)
    food_item = models.ForeignKey(FoodItem, null=False, on_delete=models.CASCADE, related_name='pack_list')

    def __str__(self):
        return u"{}".format(self.task)


