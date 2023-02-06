from django.urls import path
from rest_framework_nested import routers

from baseinfo.views import commonviews
from baseinfo.imagecomponent.views import QualityAttributeImageViewSet, SubjectImageViewSet, ProfileImageViewSet
from baseinfo.views import profileviews, importprofileviews
from baseinfo.views import expertgroupviews




router = routers.DefaultRouter()
router.register('profiles', profileviews.AssessmentProfileViewSet, basename='profiles')
router.register('metriccategories', commonviews.MetricCategoryViewSet, basename='metriccategories')
router.register('subjects', commonviews.AssessmentSubjectViewSet, basename='subjects')
router.register('attributes', commonviews.QualityAttributeViewSet, basename='attributes')
router.register('dsl', profileviews.UploadProfileApi, basename='dsl')
router.register('tags', profileviews.ProfileTagViewSet, basename='tags')
router.register('expertgroups', expertgroupviews.ExpertGroupViewSet, basename='expertgroups')


metric_category_router = routers.NestedDefaultRouter(router, 'metriccategories', lookup='metric_category')
metric_category_router.register('metrics', commonviews.MetricViewSet, basename='metric-category-metrics')

attribute_router = routers.NestedDefaultRouter(router, 'attributes', lookup='attribute')
attribute_router.register('images', QualityAttributeImageViewSet, basename='attribute-images')

subject_router = routers.NestedDefaultRouter(router, 'subjects', lookup='subject')
subject_router.register('images', SubjectImageViewSet, basename='subject-images')

profile_router = routers.NestedDefaultRouter(router, 'profiles', lookup='profile')
profile_router.register('images', ProfileImageViewSet, basename='profile-images')

expert_group_access_router = routers.NestedDefaultRouter(router, 'expertgroups', lookup='expertgroup')
expert_group_access_router.register('expertgroupaccess', expertgroupviews.ExpertGroupAccessViewSet, basename='expertgroup-user-access')

metric_category_by_subject_router = routers.NestedDefaultRouter(router, 'subjects', lookup='assessment_subject')
metric_category_by_subject_router.register('metriccategories', commonviews.MetricCategoryBySubjectViewSet, basename='subject-metriccategories')


urlpatterns = router.urls + metric_category_router.urls + metric_category_by_subject_router.urls + attribute_router.urls + subject_router.urls + profile_router.urls + expert_group_access_router.urls

urlpatterns += [
    path("inspectprofile/<str:profile_id>/", profileviews.ProfileDetailDisplayApi.as_view()),
    path("expertgroup/profiles/<str:expert_group_id>/", profileviews.ProfileListApi.as_view()),
    path("importprofile/", importprofileviews.ImportProfileApi.as_view()),
    path("addexpertgroup/<str:expert_group_id>/", expertgroupviews.AddUserToExpertGroupApi.as_view()),
    path("expertgroup/confirm/<str:token>/", expertgroupviews.ConfirmUserForExpertGroupApi.as_view()),
    path("profiles/archive/<str:profile_id>/", profileviews.ProfileArchiveApi.as_view()),
    path("profiles/publish/<str:profile_id>/", profileviews.ProfilePublishApi.as_view()),
    path("profiles/like/<str:profile_id>/", profileviews.ProfileLikeApi.as_view()),
    path("profiles/options/select/", profileviews.ProfileListOptionsApi.as_view()),
]