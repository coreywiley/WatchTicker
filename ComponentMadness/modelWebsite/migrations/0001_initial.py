# Generated by Django 2.0.7 on 2018-08-07 16:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import jsonfield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Component',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('html', models.TextField(blank=True, default='')),
                ('name', models.CharField(blank=True, default='', max_length=120)),
                ('description', models.TextField(blank=True, default='')),
                ('example', models.TextField(blank=True, default='')),
            ],
        ),
        migrations.CreateModel(
            name='ComponentProp',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, default='', max_length=120)),
                ('type', models.CharField(blank=True, default='', max_length=120)),
                ('component', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='componentProps', to='modelWebsite.Component')),
            ],
        ),
        migrations.CreateModel(
            name='ComponentRequirement',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('importStatement', models.TextField(blank=True, default='')),
                ('component', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='componentRequirements', to='modelWebsite.Component')),
            ],
        ),
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
            name='Page',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, default='', max_length=120)),
                ('url', models.CharField(blank=True, default='', max_length=120)),
            ],
        ),
        migrations.CreateModel(
            name='PageComponent',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('data_url', models.CharField(blank=True, default='', max_length=120)),
                ('data', jsonfield.fields.JSONField(blank=True, default={})),
                ('order', models.IntegerField()),
                ('component', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pageComponents', to='modelWebsite.Component')),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pageComponents', to='modelWebsite.Page')),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('image', models.CharField(blank=True, default='', max_length=120)),
                ('text', models.CharField(blank=True, default='', max_length=120)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to=settings.AUTH_USER_MODEL)),
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
        migrations.AddField(
            model_name='field',
            name='model',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='fields', to='modelWebsite.Model'),
        ),
    ]