from . import views
from .imagecomponent.views import QualityAttributeImageViewSet, SubjectImageViewSet, ProfileImageViewSet
from rest_framework_nested import routers


router = routers.DefaultRouter()
router.register('profiles', views.AssessmentProfileViewSet, basename='profiles')
router.register('metriccategories', views.MetricCategoryViewSet, basename='metriccategories')
router.register('subjects', views.AssessmentSubjectViewSet, basename='subjects')
router.register('attributes', views.QualityAttributeViewSet, basename='attributes')


metric_category_router = routers.NestedDefaultRouter(router, 'metriccategories', lookup='metric_category')
metric_category_router.register('metrics', views.MetricViewSet, basename='metric-category-metrics')


# attribute_router = routers.NestedDefaultRouter(router, 'subjects', lookup='assessment_subject')
# attribute_router.register('attributes', views.QualityAttributeViewSet, basename='subject-attributes')

attribute_router = routers.NestedDefaultRouter(router, 'attributes', lookup='attribute')
attribute_router.register('images', QualityAttributeImageViewSet, basename='attribute-images')

subject_router = routers.NestedDefaultRouter(router, 'subjects', lookup='subject')
subject_router.register('images', SubjectImageViewSet, basename='subject-images')

profile_router = routers.NestedDefaultRouter(router, 'profiles', lookup='profile')
profile_router.register('images', ProfileImageViewSet, basename='profile-images')



metric_category_by_subject_router = routers.NestedDefaultRouter(router, 'subjects', lookup='assessment_subject')
metric_category_by_subject_router.register('metriccategories', views.MetricCategoryBySubjectViewSet, basename='subject-metriccategories')


urlpatterns = router.urls + metric_category_router.urls + metric_category_by_subject_router.urls + attribute_router.urls + subject_router.urls + profile_router.urls

