from django.urls import path

from baseinfo.views import expert_group_views

urlpatterns = [
    path('', expert_group_views.ExpertGroupsApi.as_view()),
    path('<str:expert_group_id>/', expert_group_views.ExpertGroupApi.as_view()),
    path('<str:expert_group_id>/members/', expert_group_views.ExpertGroupMembersApi.as_view()),
    path('<str:expert_group_id>/invite/', expert_group_views.ExpertGroupInviteMembersApi.as_view()),
    path('<str:expert_group_id>/invite/<str:invite_token>/confirm/', expert_group_views.ExpertGroupInviteMembersConfirmApi.as_view()),
]
