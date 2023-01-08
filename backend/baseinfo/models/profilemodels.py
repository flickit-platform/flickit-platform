from django.db import models
from account.models import User


class ExpertGroup(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True)
    website = models.URLField(max_length = 200, null=True)
    picture = models.ImageField(upload_to='expertgroup/images', null=True)
    users = models.ManyToManyField(User, related_name = 'expert_groups')
    owner = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    

class AssessmentProfile(models.Model):
    code = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    description = models.TextField()
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
    code = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    profiles = models.ManyToManyField(AssessmentProfile, related_name = 'tags')

    class Meta:
        verbose_name = 'Profile Tag'
        verbose_name_plural = "Profile Tags"

    def __str__(self) -> str:
        return self.title