# Generated by Django 2.0.5 on 2018-12-12 02:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0022_auto_20181210_1709'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notifications',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, default='', max_length=1200)),
                ('title', models.CharField(blank=True, default='', max_length=1200)),
                ('body', models.CharField(blank=True, default='', max_length=1200)),
                ('date', models.CharField(blank=True, default='', max_length=1200)),
                ('days_after', models.IntegerField(default=0)),
                ('repeat', models.IntegerField(default=0)),
            ],
        ),
    ]
