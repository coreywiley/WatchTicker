# Generated by Django 2.0.6 on 2018-09-22 16:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0007_auto_20180920_1205'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customer',
            name='user',
        ),
        migrations.RemoveField(
            model_name='decorationlistitem',
            name='food_item',
        ),
        migrations.RemoveField(
            model_name='event',
            name='customer',
        ),
        migrations.RemoveField(
            model_name='event',
            name='user',
        ),
        migrations.RemoveField(
            model_name='fooditem',
            name='user',
        ),
        migrations.RemoveField(
            model_name='order',
            name='event',
        ),
        migrations.RemoveField(
            model_name='order',
            name='food_item',
        ),
        migrations.RemoveField(
            model_name='packinglistitem',
            name='food_item',
        ),
        migrations.RemoveField(
            model_name='preplistitem',
            name='food_item',
        ),
        migrations.RemoveField(
            model_name='shoppinglistitem',
            name='food_item',
        ),
        migrations.DeleteModel(
            name='Customer',
        ),
        migrations.DeleteModel(
            name='DecorationListItem',
        ),
        migrations.DeleteModel(
            name='Event',
        ),
        migrations.DeleteModel(
            name='FoodItem',
        ),
        migrations.DeleteModel(
            name='Order',
        ),
        migrations.DeleteModel(
            name='PackingListItem',
        ),
        migrations.DeleteModel(
            name='PrepListItem',
        ),
        migrations.DeleteModel(
            name='ShoppingListItem',
        ),
    ]
