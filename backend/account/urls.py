from . import views
from assessment.views import projectviews
from rest_framework_nested import routers

router = routers.DefaultRouter()
router.register('spaces', views.SpaceViewSet, basename='spaces')



user_access_router = routers.NestedDefaultRouter(router, 'spaces', lookup='space')
user_access_router.register('useraccess', views.UserAccessViewSet, basename='space-user-access')


assessments_router = routers.NestedDefaultRouter(router, 'spaces', lookup='space')
assessments_router.register('assessments', projectviews.AssessmentProjectBySpaceViewSet, basename='space-assessments')



urlpatterns = router.urls + user_access_router.urls + assessments_router.urls
