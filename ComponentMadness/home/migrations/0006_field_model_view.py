# Generated by Django 2.0.1 on 2018-04-22 22:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0005_componentdatafield_attribute_to_change'),
    ]

    operations = [
        migrations.CreateModel(
            name='Field',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, default='', max_length=120)),
                ('fieldType', models.CharField(blank=True, default='', max_length=120)),
                ('default', models.CharField(blank=True, default='', max_length=120)),
                ('blank', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='Model',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, default='', max_length=120)),
            ],
        ),
        migrations.CreateModel(
            name='View',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, default='', max_length=120)),
                ('url', models.CharField(blank=True, default='', max_length=120)),
                ('description', models.CharField(blank=True, default='', max_length=1200)),
            ],
        ),
    ]
