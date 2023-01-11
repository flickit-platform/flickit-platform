from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator

class Space(models.Model):
    code = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    users = models.ManyToManyField('User', through='UserAccess', related_name='spaces')
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey('User', on_delete=models.PROTECT, null=True)


class User(AbstractUser):
    username_validator = UnicodeUsernameValidator()
    username = models.CharField(max_length=150, unique=True, error_messages={"unique": "A user with this username already exists."})
    email = models.EmailField(unique=True, error_messages={'unique':"A user with this email address already exists."})
    current_space = models.ForeignKey(Space, on_delete=models.PROTECT, null=True)


class UserAccess(models.Model):
    space = models.ForeignKey('Space', on_delete=models.CASCADE)
    user =  models.ForeignKey('User', on_delete=models.CASCADE, null=True)
    invite_email = models.EmailField(null = True)

    class Meta:
        unique_together = ('space', 'user')