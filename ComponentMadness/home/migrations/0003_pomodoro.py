# Generated by Django 2.0.5 on 2019-03-11 06:16

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0002_task_completed'),
    ]

    operations = [
        migrations.CreateModel(
            name='Pomodoro',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pomodoro_objects', to='home.Task')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
