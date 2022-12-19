from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from ..models import AssessmentProfile, AssessmentSubject, Metric, MetricCategory, QualityAttribute
from ..serializers.commonserializers import AssessmentSubjectSerilizer, MetricCategorySerilizer, MetricSerilizer, QualityAttributeSerilizer, MetricCategoryBySubjectSerilizer
from ..serializers.profileserializers import AssessmentProfileSerilizer


class MetricCategoryViewSet(ModelViewSet):
    serializer_class = MetricCategorySerilizer

    def get_queryset(self):
        return MetricCategory.objects.all()


class MetricViewSet(ModelViewSet):
    serializer_class = MetricSerilizer
    def get_queryset(self):
        return Metric.objects.filter(metric_category_id=self.kwargs['metric_category_pk']).order_by('index')


class MetricCategoryBySubjectViewSet(ModelViewSet):
    serializer_class = MetricCategoryBySubjectSerilizer
    def get_queryset(self):
        return MetricCategory.objects.prefetch_related('assessment_subjects').filter(assessment_subjects__id=self.kwargs['assessment_subject_pk']).order_by('index')


class AssessmentSubjectViewSet(ModelViewSet):
    serializer_class = AssessmentSubjectSerilizer

    def get_queryset(self):
        return AssessmentSubject.objects.all().order_by('index')


class QualityAttributeViewSet(ModelViewSet):
    serializer_class = QualityAttributeSerilizer

    def get_queryset(self):
        if 'assessment_subject_pk' in self.kwargs:
            return QualityAttribute.objects.filter(assessment_subject_id=self.kwargs['assessment_subject_pk']).order_by('index');
        else:
            return QualityAttribute.objects.all().order_by('index')
            


class AssessmentProfileViewSet(ModelViewSet):
    serializer_class = AssessmentProfileSerilizer
    filter_backends=[DjangoFilterBackend, SearchFilter]
    filterset_fields = ['metric_categories']
    search_fields = ['title']

    def get_queryset(self):
        queryset = AssessmentProfile.objects.all()
        metric_categories = self.request.query_params.get('metric_categories')
        if metric_categories is not None:
            queryset = queryset.filter(metric_categories=metric_categories)
        return queryset

    def destroy(self, request, *args, **kwargs):
        if MetricCategory.objects.filter(assessment_profile_id=kwargs['pk']).count() > 0:
            return Response({'error' : 'AssessmentProfile cannot be deleted'})
        return super().destroy(request, *args, ** kwargs)

