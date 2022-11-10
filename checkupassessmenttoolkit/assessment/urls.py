from django.urls import path
from rest_framework_nested import routers
from . import views
from assessment.report import reportviews
from assessment.report.subjectreportviews import SubjectReportViewSet
from .questionary.questionaryviews import QuestionaryView



router = routers.DefaultRouter()
router.register('reports', reportviews.AssessmentReportViewSet, basename='reports')
router.register('reportsubject', SubjectReportViewSet, basename='reportsubject')
router.register('projects', views.AssessmentProjectViewSet, basename='projects')
router.register('results', views.AssessmentResultRegisterViewSet, basename='results')
router.register('colors', views.ColorViewSet, basename='colors')


metric_value_router = routers.NestedDefaultRouter(router, 'results', lookup='assessment_result')
metric_value_router.register('metricvalues', views.MetricValueViewSet, basename='result-metric-values')

urlpatterns = router.urls + metric_value_router.urls

urlpatterns += [
    path("questionaries/<str:assessment_project_id>", QuestionaryView.as_view())
]