# Generated by Django 2.0.5 on 2018-12-09 22:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0019_journal_notes'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserSettings',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('user', models.CharField(blank=True, default='', max_length=120)),
                ('name', models.CharField(blank=True, default='', max_length=1200)),
            ],
        ),
        migrations.RemoveField(
            model_name='journal',
            name='user',
        ),
        migrations.AddField(
            model_name='journal',
            name='uuser',
            field=models.CharField(blank=True, default='', max_length=120),
        ),
        migrations.AlterField(
            model_name='answer',
            name='user',
            field=models.CharField(blank=True, default='', max_length=120),
        ),
        migrations.AlterField(
            model_name='customize',
            name='user',
            field=models.CharField(blank=True, default='', max_length=120),
        ),
        migrations.AlterField(
            model_name='doctor',
            name='user',
            field=models.CharField(blank=True, default='', max_length=120),
        ),
    ]
