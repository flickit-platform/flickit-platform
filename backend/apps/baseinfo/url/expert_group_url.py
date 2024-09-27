from django.urls import path

from baseinfo.views import expert_group_views

urlpatterns = [
    path('', expert_group_views.ExpertGroupsApi.as_view()),
    path('<str:expert_group_id>/', expert_group_views.ExpertGroupApi.as_view()),
    path('<str:expert_group_id>/seen/', expert_group_views.ExpertGroupSeenApi.as_view()),
    path('<str:expert_group_id>/picture/', expert_group_views.ExpertGroupPictureApi.as_view()),
    path('<str:expert_group_id>/assessment-kits/', expert_group_views.ExpertGroupAssessmentKitListApi.as_view()),
    path('<str:expert_group_id>/members/', expert_group_views.ExpertGroupMembersApi.as_view()),
    path('<str:expert_group_id>/members/<uuid:user_id>/', expert_group_views.ExpertGroupMemberApi.as_view()),
    path('<str:expert_group_id>/invite/', expert_group_views.ExpertGroupInviteMembersApi.as_view()),
    path('<str:expert_group_id>/invite/<str:invite_token>/confirm/', expert_group_views.ExpertGroupInviteMembersConfirmApi.as_view()),
]
