from django.urls import path
from rest_framework_nested import routers

from assessment.views import reportviews, commonviews, comparisionviews, questionvalueviews, projectviews, evidenceviews
from assessment.views.subjectreportviews import SubjectReportViewSet
from assessment.views.questionaryviews import QuestionaryView, QuestionaryBaseInfoApi


router = routers.DefaultRouter()
router.register('reports', reportviews.AssessmentReportViewSet, basename='reports')
router.register('reportsubject', SubjectReportViewSet, basename='reportsubject')
router.register('projects', projectviews.AssessmentProjectViewSet, basename='projects')
router.register('currentuserprojects', projectviews.AssessmentProjectByCurrentUserViewSet, basename='currentuserprojects')
router.register('results', commonviews.AssessmentResultRegisterViewSet, basename='results')


question_value_router = routers.NestedDefaultRouter(router, 'results', lookup='assessment_result')
question_value_router.register('questionvalues', questionvalueviews.QuestionValueViewSet, basename='result-question-values')

urlpatterns = router.urls + question_value_router.urls

urlpatterns += [
    path("questionaries/<str:assessment_project_id>/", QuestionaryView.as_view()),
    path("result/<str:assessment_project_id>/<str:questionnaire_id>/", questionvalueviews.QuestionValueListView.as_view()),
    path("progress/<str:assessment_project_id>/", questionvalueviews.TotalProgressView.as_view()),
    path("subjects/<str:assessment_project_id>/", QuestionaryBaseInfoApi.as_view()),
    path("breadcrumbinfo/", commonviews.BreadcrumbInformationView.as_view()),
    path("compare/", comparisionviews.CompareAssessmentView.as_view()),
    path("compareselect/", projectviews.AssessmentProjectSelectForCompareView.as_view()),
    path("checkreport/<str:assessment_project_id>/", reportviews.AssessmentCheckReportApi.as_view()),
    path("addevidence/<str:question_id>/<str:assessment_id>", evidenceviews.AddEvidenceApi.as_view()),
    path("updateevidence/<str:pk>/", evidenceviews.EvidenceUpdateAPI.as_view()),
    path("deleteevidence/<str:pk>/", evidenceviews.EvidenceDeleteAPI.as_view()),
    path("evidences/<str:question_id>/<str:assessment_id>/", evidenceviews.EvidenceListApi.as_view()),
    path("colors/",commonviews.ColorApi.as_view())
    
]