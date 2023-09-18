from django.urls import path
from assessment.views import projectviews
urlpatterns = [
    path("<str:space_id>/assessments/",projectviews.LoadAssessmentListApi.as_view()),
]