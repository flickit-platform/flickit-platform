from django.urls import path
from assessment.views import projectviews
urlpatterns = [
    path("", projectviews.AssessmentProjectApi.as_view()),
]
