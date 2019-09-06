# Generated by Django 2.0.6 on 2019-08-31 18:16

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('modelWebsite', '0007_page_pagegroup'),
    ]

    operations = [
        migrations.AddField(
            model_name='modelconfig',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='modelconfig',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]