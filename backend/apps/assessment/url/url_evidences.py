from django.urls import path
from assessment.views import projectviews, questionvalueviews, questionaryviews, reportviews, evidenceviews
urlpatterns = [
    path("", evidenceviews.EvidencesApi.as_view()),
]
