# Generated by Django 2.0.6 on 2019-05-12 20:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0002_auto_20190512_1330'),
    ]

    operations = [
        migrations.AddField(
            model_name='watch_instance',
            name='source',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='watch_instances', to='home.Source'),
        ),
    ]
