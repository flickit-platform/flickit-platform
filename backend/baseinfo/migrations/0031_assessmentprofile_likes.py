# Generated by Django 4.1.5 on 2023-01-15 14:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('baseinfo', '0030_assessmentprofile_about_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='assessmentprofile',
            name='likes',
            field=models.IntegerField(default=0),
        ),
    ]
