from rest_framework.viewsets import ModelViewSet

from baseinfo.models.basemodels import AssessmentSubject, MetricCategory, QualityAttribute
from baseinfo.models.metricmodels import Metric
from baseinfo.serializers import commonserializers

class MetricCategoryViewSet(ModelViewSet):
    serializer_class = commonserializers.MetricCategorySerilizer

    def get_queryset(self):
        return MetricCategory.objects.all()


class MetricViewSet(ModelViewSet):
    serializer_class = commonserializers.MetricSerilizer
    def get_queryset(self):
        return Metric.objects.filter(metric_category_id=self.kwargs['metric_category_pk']).order_by('index')


class MetricCategoryBySubjectViewSet(ModelViewSet):
    serializer_class = commonserializers.MetricCategoryBySubjectSerilizer
    def get_queryset(self):
        return MetricCategory.objects.prefetch_related('assessment_subjects').filter(assessment_subjects__id=self.kwargs['assessment_subject_pk']).order_by('index')


class AssessmentSubjectViewSet(ModelViewSet):
    serializer_class = commonserializers.AssessmentSubjectSerilizer

    def get_queryset(self):
        return AssessmentSubject.objects.all().order_by('index')


class QualityAttributeViewSet(ModelViewSet):
    serializer_class = commonserializers.QualityAttributeSerilizer

    def get_queryset(self):
        if 'assessment_subject_pk' in self.kwargs:
            return QualityAttribute.objects.filter(assessment_subject_id=self.kwargs['assessment_subject_pk']).order_by('index');
        else:
            return QualityAttribute.objects.all().order_by('index')
            


