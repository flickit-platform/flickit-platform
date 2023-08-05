from uuid import uuid4
from django.db import models

from baseinfo.models.assessmentkitmodels import AssessmentKit, MaturityLevel
from baseinfo.models.questionmodels import Question
from baseinfo.models.questionmodels import AnswerTemplate
from baseinfo.models.basemodels import QualityAttribute
from account.models import Space, User


class Color(models.Model):
    title = models.CharField(max_length=40, unique=True)
    color_code = models.CharField(max_length=20, unique=True)

class AssessmentProjectManager(models.Manager):
    def load(self, assessment_id):
        try:
            return AssessmentProject.objects.get(id = assessment_id)
        except AssessmentProject.DoesNotExist:
            raise AssessmentProject.DoesNotExist

class AssessmentProject(models.Model):

    STATUS_CHOICES = [
        ('ELEMENTARY', 'ELEMENTARY'),
        ('WEAK', 'WEAK'),
        ('MODERATE', 'MODERATE'),
        ('GOOD', 'GOOD'),
        ('GREAT', 'GREAT')
    ]

    id = models.UUIDField(primary_key=True, default=uuid4)
    code = models.SlugField(max_length=100)
    title = models.CharField(max_length=100)
    description = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    assessment_kit = models.ForeignKey(AssessmentKit, on_delete=models.PROTECT, related_name='assessment_projects')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, null=True)
    maturity_level = models.ForeignKey(MaturityLevel, on_delete=models.CASCADE, related_name='assessment_projects', null= True)
    color = models.ForeignKey(Color, on_delete=models.PROTECT, null=True)
    space = models.ForeignKey(Space, on_delete=models.PROTECT, related_name='projects')
    objects = AssessmentProjectManager()

    class Meta:
        unique_together = [('title', 'space'), ('code', 'space')]

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
    maturity_level_value = models.PositiveIntegerField(null=True)
    maturity_level = models.ForeignKey(MaturityLevel, on_delete=models.CASCADE, related_name='quality_attribute_values', null = True)


class QuestionValue(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4)
    assessment_result = models.ForeignKey(AssessmentResult, on_delete=models.CASCADE, related_name='question_values')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='question_values')
    answer = models.ForeignKey(AnswerTemplate, on_delete=models.CASCADE, null=True)


class EvidenceRelation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='evidences')
    assessment = models.ForeignKey(AssessmentProject, on_delete=models.CASCADE, related_name='evidences')
    

class Evidence(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4)
    description = models.TextField()
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    evidence_relation = models.ForeignKey(EvidenceRelation, on_delete=models.CASCADE)
    










