from uuid import uuid4
from django.db import models

from baseinfo.models.profilemodels import AssessmentProfile
from baseinfo.models.metricmodels import Metric
from baseinfo.models.metricmodels import AnswerTemplate
from baseinfo.models.basemodels import QualityAttribute
from account.models import Space


class Color(models.Model):
    title = models.CharField(max_length=40, unique=True)
    color_code = models.CharField(max_length=20, unique=True)

class AssessmentProjectManager(models.Manager):
    def load(self, assessment_id):
        try:
            return AssessmentProject.objects.get(id = assessment_id)
        except AssessmentProject.DoesNotExist:
            return None

class AssessmentProject(models.Model):

    STATUS_CHOICES = [
        ('WEAK', 'WEAK'),
        ('RISKY', 'RISKY'),
        ('NORMAL', 'NORMAL'),
        ('GOOD', 'GOOD'),
        ('OPTIMIZED', 'OPTIMIZED')
    ]

    id = models.UUIDField(primary_key=True, default=uuid4)
    code = models.SlugField(max_length=100, unique=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    assessment_profile = models.ForeignKey(AssessmentProfile, on_delete=models.PROTECT, related_name='assessment_projects')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, null=True)
    color = models.ForeignKey(Color, on_delete=models.PROTECT, null=True)
    space = models.ForeignKey(Space, on_delete=models.PROTECT)
    objects = AssessmentProjectManager()

    class Meta:
        unique_together = [('title', 'space')]

    def __str__(self) -> str:
        return self.title
        
    def get_assessment_result(self):
        return self.assessment_results.first()

class AssessmentResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4)
    assessment_project = models.ForeignKey(AssessmentProject, on_delete=models.CASCADE, related_name='assessment_results')

class QualityAttributeValue(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4)
    assessment_result = models.ForeignKey(AssessmentResult, on_delete=models.CASCADE, related_name='quality_attribute_values')
    quality_attribute = models.ForeignKey(QualityAttribute, on_delete=models.CASCADE, related_name='quality_attribute_values')
    maturity_level_value = models.PositiveIntegerField()


class MetricValue(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4)
    assessment_result = models.ForeignKey(AssessmentResult, on_delete=models.CASCADE, related_name='metric_values')
    metric = models.ForeignKey(Metric, on_delete=models.CASCADE, related_name='metric_values')
    answer = models.ForeignKey(AnswerTemplate, on_delete=models.CASCADE, null=True)










