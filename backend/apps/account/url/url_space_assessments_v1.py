from django.urls import path

from account.views import space_views

urlpatterns = [
    path("", space_views.SpaceAssessmentListApi.as_view()),
]
