
from django.db import models

from common.validators import validate_file_size

from account.models import User

class ExpertGroup(models.Model):
    name = models.CharField(max_length=100, unique=True)
    bio = models.CharField(max_length=200)
    about = models.TextField()
    website = models.CharField(max_length = 200, null=True, blank=True)
    picture = models.ImageField(upload_to='expertgroup/images', null=True, validators=[validate_file_size])
    users = models.ManyToManyField(User, through='ExpertGroupAccess', related_name = 'expert_groups')
    owner = models.ForeignKey(User, on_delete=models.PROTECT)

    class Meta:
        permissions = [
            ('manage_expert_group', 'Manage Expert Groups')
        ]

class ExpertGroupAccess(models.Model):
    expert_group = models.ForeignKey('ExpertGroup', on_delete=models.CASCADE)
    user =  models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    invite_email = models.EmailField(null = True)
    invite_expiration_date = models.DateTimeField(null=True)

    class Meta:
        unique_together = ('expert_group', 'user')
    

class AssessmentProfile(models.Model):
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=100, unique=True)
    summary = models.TextField()
    about = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    expert_group = models.ForeignKey(ExpertGroup, on_delete=models.CASCADE, related_name='profiles')
    is_active = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.title
    
    class Meta:
        verbose_name = "Assessment Profile"
        verbose_name_plural = "Assessment Profiles"
        ordering = ['title']

class ProfileDsl(models.Model):
    dsl_file = models.FileField(upload_to='profile/dsl', validators=[validate_file_size])

class ProfileTag(models.Model):
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=100, unique=True)
    profiles = models.ManyToManyField(AssessmentProfile, related_name = 'tags')

    class Meta:
        verbose_name = 'Profile Tag'
        verbose_name_plural = "Profile Tags"

    def __str__(self) -> str:
        return self.title

class ProfileLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    profile = models.ForeignKey(AssessmentProfile, on_delete=models.CASCADE, related_name='likes')


class MaturityLevel(models.Model):
    title = models.CharField(max_length=100)
    value = models.PositiveSmallIntegerField()
    profile = models.ForeignKey(AssessmentProfile, on_delete=models.CASCADE, related_name='maturity_levels')

    class Meta:
        verbose_name = 'Questionnaire'
        verbose_name_plural = "Questionnaires"
        unique_together = [('title', 'profile'), ('value', 'profile')]

class LevelCompetence(models.Model):
    maturity_level = models.ForeignKey(MaturityLevel, on_delete=models.CASCADE, related_name='level_competences')
    value = models.PositiveIntegerField(null=True)
    maturity_level_competence = models.ForeignKey(MaturityLevel, on_delete=models.CASCADE, null=True)
    