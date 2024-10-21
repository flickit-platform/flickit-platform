from django.urls import path

from baseinfo.views import kit_versions_views

urlpatterns = [
    path("<str:kit_version_id>/", kit_versions_views.KitVersionsApi.as_view()),
    path("<str:kit_version_id>/subjects/", kit_versions_views.KitVersionSubjectsApi.as_view()),
    path("<str:kit_version_id>/subjects/<str:subject_id>/", kit_versions_views.KitVersionSubjectApi.as_view()),
    path("<str:kit_version_id>/subjects-change-order/",
         kit_versions_views.SubjectChangeOrderApi.as_view()),
    path("<str:kit_version_id>/activate/", kit_versions_views.KitActiveApi.as_view()),
    path("<str:kit_version_id>/maturity-levels/", kit_versions_views.KitVersionMaturityLevelsApi.as_view()),
    path("<str:kit_version_id>/maturity-levels/<str:maturity_level_id>/",
         kit_versions_views.KitVersionMaturityLevelApi.as_view()),
    path("<str:kit_version_id>/maturity-levels-change-order/",
         kit_versions_views.MaturityLevelsChangeOrderApi.as_view()),
    path("<str:kit_version_id>/level-competences/", kit_versions_views.LevelCompetencesApi.as_view()),
    path("<str:kit_version_id>/level-competences/<str:level_competence_id>/",
         kit_versions_views.LevelCompetenceApi.as_view()),
    path("<str:kit_version_id>/attributes/", kit_versions_views.AttributesApi.as_view())
]
