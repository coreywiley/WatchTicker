# Generated by Django 2.0.5 on 2019-02-10 17:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('modelWebsite', '0004_auto_20190210_1042'),
    ]

    operations = [
        migrations.AlterField(
            model_name='page',
            name='componentProps',
            field=models.TextField(default='[]'),
        ),
        migrations.AlterField(
            model_name='page',
            name='components',
            field=models.TextField(default='[]'),
        ),
    ]
