# Generated by Django 2.0.6 on 2019-05-23 16:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0013_watch_instance_info'),
    ]

    operations = [
        migrations.AddField(
            model_name='source',
            name='url',
            field=models.CharField(default='', max_length=1000),
        ),
    ]