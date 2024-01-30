from django.urls import path

from baseinfo.views import expert_group_views

urlpatterns = [
    path('', expert_group_views.ExpertGroupApi.as_view()),
]
