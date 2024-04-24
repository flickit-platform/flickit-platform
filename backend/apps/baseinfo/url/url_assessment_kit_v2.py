from django.urls import path

from baseinfo.views import assessment_kit_views

urlpatterns = [
    path("<str:assessment_kit_id>/stats/", assessment_kit_views.AssessmentKitStateView.as_view()),
    path("<str:assessment_kit_id>/info/", assessment_kit_views.AssessmentKitInfoView.as_view()),
    path("<str:assessment_kit_id>/", assessment_kit_views.AssessmentKitView.as_view()),
    path("<str:assessment_kit_id>/details/", assessment_kit_views.AssessmentKitDetailsView.as_view()),
    path("<str:assessment_kit_id>/details/subjects/<str:subject_id>/",
         assessment_kit_views.AssessmentKitDetailsSubjectView.as_view()),
    path("<str:assessment_kit_id>/details/attributes/<str:attribute_id>/",
         assessment_kit_views.AssessmentKitDetailsAttributesView.as_view()),
    path("<str:assessment_kit_id>/details/questionnaires/<str:questionnaire_id>/",
         assessment_kit_views.AssessmentKitDetailsQuestionnairesView.as_view()),
    path("<str:assessment_kit_id>/details/questions/<str:question_id>/",
         assessment_kit_views.AssessmentKitDetailsQuestionView.as_view()),

]
