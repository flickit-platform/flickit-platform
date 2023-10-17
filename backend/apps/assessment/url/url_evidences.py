from django.urls import path
from assessment.views import evidenceviews
urlpatterns = [
    path("", evidenceviews.EvidencesApi.as_view()),
    path("<uuid:evidence_id>/", evidenceviews.EvidenceApi.as_view()),
]
