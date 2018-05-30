# Generated by Django 2.0.5 on 2018-05-30 21:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0010_auto_20180530_1127'),
    ]

    operations = [
        migrations.AlterField(
            model_name='field',
            name='model',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='fields', to='home.Model'),
        ),
        migrations.AlterField(
            model_name='pagecomponent',
            name='component',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pageComponents', to='home.Component'),
        ),
        migrations.AlterField(
            model_name='pagecomponent',
            name='page',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pageComponents', to='home.Page'),
        ),
        migrations.AlterField(
            model_name='post',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='home.User'),
        ),
    ]
