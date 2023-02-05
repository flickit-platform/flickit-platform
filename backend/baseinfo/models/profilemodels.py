from django.db import models
from account.models import User


class ExpertGroup(models.Model):
    name = models.CharField(max_length=100, unique=True)
    bio = models.CharField(max_length=200, null=True, blank=True)
    about = models.TextField(null=True)
    website = models.CharField(max_length = 200, null=True, blank=True)
    picture = models.ImageField(upload_to='expertgroup/images', null=True)
    users = models.ManyToManyField(User, through='ExpertGroupAccess', related_name = 'expert_groups')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

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
    summary = models.TextField(null=True)
    about = models.TextField(null=True)
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    is_default = models.BooleanField(default=False)
    expert_group = models.ForeignKey(ExpertGroup, on_delete=models.CASCADE, related_name='profiles', null=True)
    is_active = models.BooleanField(default=False)


    def save(self):
        if(self.is_default == True):
            default_profile = AssessmentProfile.objects.filter(is_default=True).first()
            if(default_profile and self.id != default_profile.id):
                default_profile.is_default = False
                default_profile.save()
        return super(AssessmentProfile, self).save()

    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name = "Assessment Profile"
        verbose_name_plural = "Assessment Profiles"
        ordering = ['title']

class ProfileDsl(models.Model):
    dsl_file = models.FileField(upload_to='profile/dsl')

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