from django.urls import path

from baseinfo.views import commonviews
from baseinfo.views import assessmentkitviews

urlpatterns = [
    path("answer-template/<str:answer_tamplate_id>/option-values/", commonviews.LoadOptionValueInternalApi.as_view()),
    path("v1/assessment-kits/<str:assessment_kit_id>/subjects/",
         commonviews.LoadAssessmentSubjectInternalApi.as_view()),
    path("maturity-level/<str:maturity_level_id>/level-competences/",
         assessmentkitviews.LoadLevelCompetenceInternalApi.as_view()),
    path("quality-attribute/<str:quality_attribute_id>/question/", commonviews.LoadQuestionInternalApi.as_view()),
    path("assessment-subject/<str:assessment_subject_id>/quality-attributes/",
         commonviews.LoadQualityAttributeInternalApi.as_view()),
    path("questionimpact/<str:question_impact_id>/", commonviews.LoadQuestionImpactInternalApi.as_view()),
    path("v1/assessment-kits/<str:assessment_kit_id>/questions/", commonviews.LoadQuestionsInternalApi.as_view()),
    path("v1/answer-options/", commonviews.LoadAnswerOptionWithlistIdInternalApi.as_view()),
    path("v1/subjects/<int:subject_id>/questions/", commonviews.LoadQuestionsOfSubjectInternalApi.as_view()),

]
