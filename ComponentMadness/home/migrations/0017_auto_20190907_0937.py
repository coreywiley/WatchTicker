# Generated by Django 2.0.6 on 2019-09-07 15:37

from django.conf import settings
from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('home', '0016_auto_20190831_1420'),
    ]

    operations = [
        migrations.CreateModel(
            name='InstantQuote',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('reference_number', models.CharField(db_index=True, default='', max_length=1000)),
                ('gender', models.CharField(default='', max_length=1000)),
                ('name', models.CharField(default='', max_length=1000)),
                ('description', models.TextField(default='')),
                ('price', models.FloatField(default=0.0)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
