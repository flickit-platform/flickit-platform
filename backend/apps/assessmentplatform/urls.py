from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf.urls.static import static
from django.contrib.auth.decorators import login_required

from baseinfo.models.assessmentkitmodels import AssessmentKitDsl
from assessmentplatform import settings
from baseinfo.views import importassessmentkitviews

admin.autodiscover()

urlpatterns = [
    path(r'ht/', include('health_check.urls')),
    path("admin/", admin.site.urls),
    path('authinfo/', include('djoser.urls')),
    path('baseinfo/', include('baseinfo.urls')),
    path('authinfo/', include('account.urls')),
    path('api/v1/assessment-kits/', include('baseinfo.url.url_assessment_kit_v1')),
    path('api/v2/assessment-kits/', include('baseinfo.url.url_assessment_kit_v2')),
    path('api/v1/assessment-kit-tags/', include('baseinfo.url.url_assessment_kit_tags_v1')),
    path('api/v1/assessments/', include('assessment.url.url_assessment_v1')),
    path('api/v2/assessments/', include('assessment.url.url_assessment_v2')),
    path('api/v1/assessments-compare/', include('assessment.url.url_assessments_compare_v1')),
    path('api/v1/comparable-assessments/', include('assessment.url.url_comparable_assessments_v1')),
    path('api/v1/assessment-user-roles/', include('assessment.url.url_assessment_user_roles_v1')),
    path('api/v1/evidences/', include('assessment.url.url_evidences')),
    path('api/v1/path-info/', include('assessment.url.url_path_info')),
    path('api/v1/confidence-levels/', include('assessment.url.confidence-levels-url')),
    path('api/v1/expert-groups/', include('baseinfo.url.expert_group_url')),
    path('api/v1/spaces/', include('account.url.url_space_v1')),
    path('api/v1/users/', include('account.url.url_users_v1')),
    path('api/v1/user-profile/', include('account.url.url_user_profile_v1')),
    path('api/v1/space-assessments/', include('account.url.url_space_assessments_v1')),
    path('api/v1/space-invitations/', include('account.url.url_space_invitations_v1')),
    path('api/v1/tenant/', include('account.url.url_tenant_v1')),
]

if settings.PRODUCTION_STATE == False:
    schema_view = get_schema_view(
        openapi.Info(
            title="Assessment-Platform API",
            default_version=settings.__version__,
            description="Test description",
        ),
        public=True,
        permission_classes=[permissions.AllowAny],
    )
    urlpatterns.append(
        path('swagger/', login_required(schema_view.with_ui('swagger', cache_timeout=0), login_url="/admin/login/"),
             name='schema-swagger-ui'))
