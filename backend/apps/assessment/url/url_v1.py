from django.urls import path
from assessment.views import projectviews, commonviews

urlpatterns = [
    path("", projectviews.AssessmentProjectApi.as_view()),
    path("colors/", commonviews.ColorApi.as_view()),
]
