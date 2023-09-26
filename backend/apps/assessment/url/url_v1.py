from django.urls import path
from assessment.views import projectviews, questionvalueviews
urlpatterns = [
    path("", projectviews.AssessmentProjectApi.as_view()),
    path("<uuid:assessment_id>/answer-question/", questionvalueviews.AnswerQuestionApi.as_view()),
    path("<uuid:assessment_id>/calculate/", questionvalueviews.MaturityLevelCalculateApi.as_view()),
    path("<uuid:assessment_id>/<int:questionnaire_id>/", questionvalueviews.LoadQuestionnaireAnswerApi.as_view()),

]
