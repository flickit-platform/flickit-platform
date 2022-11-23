from django.db import models
from baseinfo.models import AssessmentProfile, Metric
from uuid import uuid4
from django.utils.text import slugify 
from baseinfo.models import AnswerTemplate
from baseinfo.models import QualityAttribute
from account.models import Space


class Color(models.Model):
    title = models.CharField(max_length=40)
    color_code = models.CharField(max_length=20)

class AssessmentProject(models.Model):

    STATUS_CHOICES = [
        ('WEAK', 'WEAK'),
        ('RISKY', 'RISKY'),
        ('NORMAL', 'NORMAL'),
        ('GOOD', 'GOOD'),
        ('OPTIMIZED', 'OPTIMIZED')
    ]

    id = models.UUIDField(primary_key=True, default=uuid4)
    code = models.SlugField(max_length=100)
    title = models.CharField(max_length=100)
    description = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    assessment_profile = models.ForeignKey(AssessmentProfile, on_delete=models.PROTECT, related_name='assessment_projects')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, null=True)
    color = models.ForeignKey(Color, on_delete=models.PROTECT, null=True)
    space = models.ForeignKey(Space, on_delete=models.PROTECT, null=True)

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        self.code = slugify(self.title)
        default_profile = AssessmentProfile.objects.filter(is_default = True).values()[0]
        self.assessment_profile_id = default_profile['id']
        super(AssessmentProject, self).save(*args, **kwargs)
        if not AssessmentResult.objects.filter(assessment_project_id = self.id).exists():
            AssessmentResult.objects.create(assessment_project_id = self.id)
        
    def get_assessment_result(self):
        return self.assessment_results.first()

class AssessmentResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4)
    assessment_project = models.ForeignKey(AssessmentProject, on_delete=models.CASCADE, related_name='assessment_results')

class QualityAttributeValue(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4)
    assessment_result = models.ForeignKey(AssessmentResult, on_delete=models.CASCADE, related_name='quality_attribute_values')
    quality_attribute = models.ForeignKey(QualityAttribute, on_delete=models.CASCADE, related_name='quality_attribute_values', null=True)
    maturity_level_value = models.PositiveIntegerField(null=True)


class MetricValue(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4)
    assessment_result = models.ForeignKey(AssessmentResult, on_delete=models.CASCADE, related_name='metric_values')
    metric = models.ForeignKey(Metric, on_delete=models.CASCADE, related_name='metric_values')
    answer = models.ForeignKey(AnswerTemplate, on_delete=models.CASCADE, null=True)










