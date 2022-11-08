from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .models import AssessmentProfile, AssessmentSubject, Metric, MetricCategory, QualityAttribute
from .serializers import AssessmentProfileSerilizer, AssessmentSubjectSerilizer, MetricCategorySerilizer, MetricSerilizer, QualityAttributeSerilizer, MetricCategoryBySubjectSerilizer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter


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

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        # metric_categories = response.data['results']
        # for category in metric_categories:
        #     answered_question = 0
        #     total_question = 0
        #     metrics = MetricCategory.objects.get(pk = category['id']).metric_set.all()
        #     total_question = metrics.len()
        #     #metric_values = MetricValue.objects.
        #     response.data['results']
        #     print(metrics)
        return response

    def get_queryset(self):
        return MetricCategory.objects.prefetch_related('assessment_subjects').filter(assessment_subjects__id=self.kwargs['assessment_subject_pk'])


class AssessmentSubjectViewSet(ModelViewSet):
    serializer_class = AssessmentSubjectSerilizer

    def get_queryset(self):
        return AssessmentSubject.objects.all()


class QualityAttributeViewSet(ModelViewSet):
    serializer_class = QualityAttributeSerilizer

    def get_queryset(self):
        if 'assessment_subject_pk' in self.kwargs:
            return QualityAttribute.objects.filter(assessment_subject_id=self.kwargs['assessment_subject_pk']);
        else:
            return QualityAttribute.objects.all()
            


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

