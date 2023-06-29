from django.urls import path

from baseinfo.views import commonviews
from baseinfo.views import assessmentkitviews, importassessmentkitviews

urlpatterns = [
    path("answertemplate/<str:answer_tamplate_id>/optionvalue/",commonviews.LoadOptionValueInternalApi.as_view()),
    path("assessmentkite/<str:assessment_kit_id>/assessmentsubject/",commonviews.LoadAssessmentSubjectInternalApi.as_view()),
    path("maturitylevel/<str:maturity_level_id>/levelcompetence/",assessmentkitviews.LoadLevelCompetenceInternalApi.as_view()),
    path("assessmentkit/<str:assessment_kit_id>/maturitylevel/",assessmentkitviews.LoadMaturityLevelInternalApi.as_view()),
    path("qualityattribute/<str:quality_attribute_id>/metric/",commonviews.LoadMetricInternalApi.as_view()),
    path("assessmentsubject/<str:assessment_subject_id>/qualityattribute/",commonviews.LoadQualityAttributeInternalApi.as_view()),
    path("assessmentkite/<str:assessment_kit_id>/assessmentsubject/qualityattribute/",commonviews.LoadAssessmentSubjectAndQualityAttributeInternalApi.as_view()),

]
