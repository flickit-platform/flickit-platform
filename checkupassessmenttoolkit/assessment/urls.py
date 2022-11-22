from django.urls import path
from rest_framework_nested import routers
from . import views
from assessment.report import reportviews
from assessment.project import views as projectviews
from assessment.report.subjectreportviews import SubjectReportViewSet
from .questionary.questionaryviews import QuestionaryView, QuestionaryBaseInfoView
from .metricvalue.metricvalueviews import MetricValueViewSet, MetricValueListView, TotalProgressView
from assessment.comparison import views as compareviews
from assessment.common import views as commonviews



router = routers.DefaultRouter()
router.register('reports', reportviews.AssessmentReportViewSet, basename='reports')
router.register('reportsubject', SubjectReportViewSet, basename='reportsubject')
router.register('projects', projectviews.AssessmentProjectViewSet, basename='projects')
router.register('currentuserprojects', projectviews.AssessmentProjectByCurrentUserViewSet, basename='currentuserprojects')
router.register('results', views.AssessmentResultRegisterViewSet, basename='results')
router.register('colors', views.ColorViewSet, basename='colors')


metric_value_router = routers.NestedDefaultRouter(router, 'results', lookup='assessment_result')
metric_value_router.register('metricvalues', MetricValueViewSet, basename='result-metric-values')

urlpatterns = router.urls + metric_value_router.urls

urlpatterns += [
    path("questionaries/<str:assessment_project_id>/", QuestionaryView.as_view()),
    path("result/<str:assessment_project_id>/<str:metric_category_id>/", MetricValueListView.as_view()),
    path("progress/<str:assessment_project_id>/", TotalProgressView.as_view()),
    path("subjects/<str:assessment_project_id>/", QuestionaryBaseInfoView.as_view()),
    # path("savecompare/<str:assessment_project_id>/", compareviews.ComparisionSaveView.as_view()),
    # path("loadcompare/", compareviews.ComparisionLoadView.as_view()),
    path("breadcrumbinfo/", commonviews.BreadcrumbInformationView.as_view()),
    path("compare/", compareviews.CompareAssessmentView.as_view()),
    path("compareselect/", projectviews.AssessmentProjectSelectForCompareView.as_view()),
]