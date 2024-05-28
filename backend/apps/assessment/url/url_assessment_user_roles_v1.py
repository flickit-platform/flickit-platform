from django.urls import path
from assessment.views import assessment_user_roles_views
urlpatterns = [
    path("", assessment_user_roles_views.AssessmentUserRolesListApi.as_view()),
]


