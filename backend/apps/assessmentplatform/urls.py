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

# dsl_path = f"{settings.MEDIA_URL} { AssessmentKitDsl._meta.get_field('dsl_file').upload_to }"
# dsl_path = dsl_path.replace(' ','')
# dsl_path = dsl_path[1:]

urlpatterns = [
    path("admin/", admin.site.urls),
    path('authinfo/', include('djoser.urls')),
    path('baseinfo/', include('baseinfo.urls')),
    path('authinfo/', include('account.urls')),
    path('api/internal/', include('baseinfo.urls_internal')),
    path('api/v1/assessment-kits/', include('baseinfo.url.url_v1')),
    path('api/v1/assessments/', include('assessment.url.url_v1')),
    path('api/v1/assessment-colors/', include('assessment.url.url_assessment_colors')),
    path('api/v1/evidences/', include('assessment.url.url_evidences')),
    path('api/v1/path-info/', include('assessment.url.url_path_info')),
    path('api/v1/confidence-levels/', include('baseinfo.url.confidence-levels-url')),

    # re_path(dsl_path+"/.*?",importassessmentkitviews.access_dsl_file),
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

# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
