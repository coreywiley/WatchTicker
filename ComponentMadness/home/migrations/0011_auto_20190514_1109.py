# Generated by Django 2.0.6 on 2019-05-14 17:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0010_auto_20190514_1108'),
    ]

    operations = [
        migrations.AlterField(
            model_name='watch_instance',
            name='sold_time',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
    ]