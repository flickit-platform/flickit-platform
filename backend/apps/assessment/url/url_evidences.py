from django.urls import path
from assessment.views import evidenceviews
urlpatterns = [
    path("", evidenceviews.EvidencesApi.as_view()),
    path("<uuid:evidence_id>/", evidenceviews.EvidenceApi.as_view()),
    path("<uuid:evidence_id>/attachments/", evidenceviews.EvidenceAttachmentsApi.as_view()),
    path("<uuid:evidence_id>/attachments/<uuid:attachment_id>/", evidenceviews.EvidenceAttachmentApi.as_view()),
]
