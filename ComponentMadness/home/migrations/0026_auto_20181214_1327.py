# Generated by Django 2.0.5 on 2018-12-14 20:27

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0025_auto_20181212_1616'),
    ]

    operations = [
        migrations.AddField(
            model_name='symptom',
            name='screen_height',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='symptom',
            name='screen_width',
            field=models.IntegerField(default=0),
        ),
    ]
