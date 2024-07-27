from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

from common.validators import validate_file_size

from uuid import uuid4


class CustomUserManager(BaseUserManager):

    def _create_user(self, email, password, display_name, **extra_fields):
        if not email:
            raise ValueError('Email must be provided')

        user = self.model(
            email=self.normalize_email(email),
            display_name=display_name,
            **extra_fields
        )

        if password is None:
            user.set_unusable_password()

        user.save(using=self._db)
        return user

    def create_user(self, email, password, display_name, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, display_name, **extra_fields)

    def create_superuser(self, email, password, display_name, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, display_name, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid4)
    email = models.EmailField(unique=True, max_length=254,
                              error_messages={'unique': "A user with this email address already exists."})
    is_active = models.BooleanField(default=True)
    display_name = models.CharField(max_length=255)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    picture = models.ImageField(upload_to='user/images', null=True, validators=[validate_file_size])
    bio = models.CharField(null=True, max_length=400)
    linkedin = models.URLField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['display_name']

    class Meta:
        db_table = 'fau_user'
