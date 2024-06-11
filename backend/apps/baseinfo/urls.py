from django.urls import path
from rest_framework_nested import routers

from baseinfo.views import commonviews
from baseinfo.views import assessmentkitviews, importassessmentkitviews
from baseinfo.views import expertgroupviews

router = routers.DefaultRouter()
router.register('tags', assessmentkitviews.AssessmentKitTagViewSet, basename='tags')
router.register('expertgroups', expertgroupviews.ExpertGroupViewSet, basename='expertgroups')

expert_group_access_router = routers.NestedDefaultRouter(router, 'expertgroups', lookup='expertgroup')
expert_group_access_router.register('expertgroupaccess', expertgroupviews.ExpertGroupAccessViewSet,
                                    basename='expertgroup-user-access')

urlpatterns = router.urls + expert_group_access_router.urls

urlpatterns += [
    path("expertgroup/<str:expert_group_id>/assessmentkits/",
         assessmentkitviews.AssessmentKitListForExpertGroupApi.as_view()),
    path("userexpertgroup/", expertgroupviews.UserExpertGroupsApiView.as_view()),
    path("addexpertgroup/<str:expert_group_id>/", expertgroupviews.AddUserToExpertGroupApi.as_view()),
    path("expertgroup/confirm/<str:token>/", expertgroupviews.ConfirmUserForExpertGroupApi.as_view()),
    path("assessmentkits/like/<str:assessment_kit_id>/", assessmentkitviews.AssessmentKitLikeApi.as_view()),
    path("assessmentkits/options/select/", assessmentkitviews.AssessmentKitListOptionsApi.as_view()),
]
