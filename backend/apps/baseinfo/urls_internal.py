from django.urls import path

from baseinfo.views import commonviews
from baseinfo.views import assessmentkitviews, importassessmentkitviews

urlpatterns = [
    path("answer-template/<str:answer_tamplate_id>/option-values/",commonviews.LoadOptionValueInternalApi.as_view()),
    path("assessment-kit/<str:assessment_kit_id>/assessment-subjects/",commonviews.LoadAssessmentSubjectInternalApi.as_view()),
    path("maturity-level/<str:maturity_level_id>/level-competences/",assessmentkitviews.LoadLevelCompetenceInternalApi.as_view()),
    path("assessment-kit/<str:assessment_kit_id>/maturity-levels/",assessmentkitviews.LoadMaturityLevelInternalApi.as_view()),
    path("quality-attribute/<str:quality_attribute_id>/question/",commonviews.LoadQuestionInternalApi.as_view()),
    path("assessment-subject/<str:assessment_subject_id>/quality-attributes/",commonviews.LoadQualityAttributeInternalApi.as_view()),
    path("questionimpact/<str:question_impact_id>/",commonviews.LoadQuestionImpactInternalApi.as_view()),
    path("v1/assessment-kits/<str:assessment_kit_id>/questions/", commonviews.LoadQuestionsInternalApi.as_view()),
]
