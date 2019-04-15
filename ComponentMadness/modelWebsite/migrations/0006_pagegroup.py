# Generated by Django 2.0.6 on 2019-04-12 21:32

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('modelWebsite', '0005_auto_20190210_1049'),
    ]

    operations = [
        migrations.CreateModel(
            name='PageGroup',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(blank=True, default='', max_length=1200)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
