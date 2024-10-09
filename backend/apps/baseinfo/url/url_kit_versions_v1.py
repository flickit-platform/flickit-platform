from django.urls import path

from baseinfo.views import kit_versions_views

urlpatterns = [
    path("<str:kit_version_id>/subjects/", kit_versions_views.KitVersionSubjectApi.as_view()),
    path("<str:kit_version_id>/maturity-levels/", kit_versions_views.KitVersionMaturityLevelsApi.as_view()),
    path("<str:kit_version_id>/maturity-levels/<str:maturity_level_id>",
         kit_versions_views.KitVersionMaturityLevelApi.as_view()),
    path("<str:kit_version_id>/maturity-levels-change-order/",
         kit_versions_views.MaturityLevelsChangeOrderApi.as_view()),
]
