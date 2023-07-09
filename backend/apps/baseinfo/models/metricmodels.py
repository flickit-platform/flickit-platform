from django.db import models

from baseinfo.models.basemodels import Questionnaire, QualityAttribute
from baseinfo.models.assessmentkitmodels import MaturityLevel

class MetricImpact(models.Model):
    level = models.PositiveIntegerField(null=True)
    maturity_level = models.ForeignKey(MaturityLevel, on_delete=models.CASCADE, related_name='metric_impacts', null = True)
    metric = models.ForeignKey('Metric', on_delete=models.CASCADE, related_name='metric_impacts')
    quality_attribute = models.ForeignKey('QualityAttribute', on_delete=models.CASCADE, related_name='metric_impacts')
    weight = models.PositiveIntegerField(default=1)

class OptionValue(models.Model):
    option = models.ForeignKey('AnswerTemplate', on_delete=models.CASCADE, related_name='option_values')
    value = models.DecimalField(max_digits=3, decimal_places=2)
    metric_impact = models.ForeignKey(MetricImpact, on_delete=models.CASCADE, related_name='option_values')

class AnswerTemplate(models.Model):
    metric = models.ForeignKey('Metric', on_delete=models.CASCADE, related_name='answer_templates')
    caption = models.CharField(max_length=255)
    value = models.PositiveSmallIntegerField()
    index = models.PositiveIntegerField()  

    class Meta:
        verbose_name = 'Answer Template'
        verbose_name_plural = "Answer Templates"
        unique_together = [('index', 'metric')]  

class Metric(models.Model):
    title = models.TextField()
    description = models.TextField(null=True)
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
    quality_attributes = models.ManyToManyField(QualityAttribute, through=MetricImpact)
    index = models.IntegerField(null=True)
    may_not_be_applicable = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Metric'
        verbose_name_plural = "Metrics"

    def __str__(self) -> str:
        return self.title