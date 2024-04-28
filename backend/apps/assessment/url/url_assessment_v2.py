from django.urls import path

from assessment.views import questionnaire_views

urlpatterns = [
    path("<uuid:assessment_id>/questionnaires/", questionnaire_views.LoadQuestionnairesWithAssessmentApi.as_view()),

]
