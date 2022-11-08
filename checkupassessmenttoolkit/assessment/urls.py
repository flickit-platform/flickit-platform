from . import views
from assessment.report import reportviews
from assessment.report.subjectreportviews import SubjectReportViewSet
from rest_framework_nested import routers


router = routers.DefaultRouter()
router.register('reports', reportviews.AssessmentReportViewSet, basename='reports')
router.register('reportsubject', SubjectReportViewSet, basename='reportsubject')
router.register('projects', views.AssessmentProjectViewSet, basename='projects')
router.register('results', views.AssessmentResultRegisterViewSet, basename='results')
router.register('colors', views.ColorViewSet, basename='colors')


metric_value_router = routers.NestedDefaultRouter(router, 'results', lookup='assessment_result')
metric_value_router.register('metricvalues', views.MetricValueViewSet, basename='result-metric-values')


attribute_value_router = routers.NestedDefaultRouter(router, 'results', lookup='assessment_result')
attribute_value_router.register('attributevalues', views.QualityAttributeViewSet, basename='result-attribute-values')



# subject_report_router = routers.NestedDefaultRouter(router, 'reports', lookup='quality_attribute')
# subject_report_router.register('subjects', SubjectReportViewSet, basename='report-subjects')

urlpatterns = router.urls + metric_value_router.urls + attribute_value_router.urls
