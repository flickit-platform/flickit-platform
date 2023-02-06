from django.db import models
from ..models.basemodels import MetricCategory, QualityAttribute

class MetricImpact(models.Model):
    level = models.PositiveIntegerField()
    metric = models.ForeignKey('Metric', on_delete=models.CASCADE, related_name='metric_impacts')
    quality_attribute = models.ForeignKey('QualityAttribute', on_delete=models.CASCADE, related_name='metric_impacts')

class AnswerTemplate(models.Model):
    metric = models.ForeignKey('Metric', on_delete=models.CASCADE, related_name='answer_templates')
    caption = models.CharField(max_length=255)
    value = models.PositiveSmallIntegerField()
    index = models.PositiveIntegerField(null=True)    

class Metric(models.Model):
    title = models.TextField()
    description = models.TextField(null=True)
    creation_time = models.DateTimeField(auto_now_add=True)
    last_modification_date = models.DateTimeField(auto_now=True)
    metric_category = models.ForeignKey(MetricCategory, on_delete=models.CASCADE)
    quality_attributes = models.ManyToManyField(QualityAttribute, through=MetricImpact)
    index = models.IntegerField(null=True)

    class Meta:
        verbose_name = 'Metric'
        verbose_name_plural = "Metrics"

    def __str__(self) -> str:
        return self.title