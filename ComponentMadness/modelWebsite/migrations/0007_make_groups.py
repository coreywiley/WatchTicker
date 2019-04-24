# Generated by Django 2.0.6 on 2019-04-12 21:32

from django.db import migrations, models
import uuid

def create_base_groups(apps, schema_editor):

    Page_Groups = apps.get_model("modelWebsite", "PageGroup")

    group = Page_Groups()
    group.id = 'e10b45fa-e37a-41b5-a003-86728149bc90'
    group.name = 'Pages'
    group.save()

    group = Page_Groups()
    group.id = '9ed43f0e-5f4e-4aa3-8303-55a4d32d3f38'
    group.name = 'Building Blocks'
    group.save()

    group = Page_Groups()
    group.id = '0294d7d0-f9cf-457c-83d7-4632682934da'
    group.name = 'Project Components'
    group.save()

class Migration(migrations.Migration):

    dependencies = [
        ('modelWebsite', '0006_pagegroup'),
    ]

    operations = [
        migrations.RunPython(create_base_groups)
    ]