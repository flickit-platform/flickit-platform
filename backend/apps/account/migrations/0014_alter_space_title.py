# Generated by Django 4.1.5 on 2023-02-14 10:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0013_alter_space_owner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='space',
            name='title',
            field=models.CharField(max_length=100),
        ),
    ]