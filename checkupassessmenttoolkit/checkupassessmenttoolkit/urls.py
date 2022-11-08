from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from django.views.i18n import set_language
from mezzanine.conf import settings
from assessmentcore.views import UserActivationView
from assessmentcore.views import ChangeCurrentSpaceViewSet

admin.autodiscover()

urlpatterns = i18n_patterns(
    path("admin/", include(admin.site.urls)),
    path('auth/', include('djoser.urls')),
    path('activate/<str:uid>/<str:token>/', UserActivationView.as_view()),
    path('changecurrentspace/<str:space_id>/', ChangeCurrentSpaceViewSet.as_view()),
    path('auth/', include('djoser.urls.jwt')),
    path('baseinfo/', include('assessmentbaseinfo.urls')),
    path('assessment/', include('assessment.urls')),
    path('authinfo/', include('assessmentcore.urls')),
    re_path(r"^version/", include("djversion.urls")),
)

if settings.USE_MODELTRANSLATION:
    urlpatterns += [
        path("i18n", set_language, name="set_language"),
    ]

urlpatterns += [
    path("", TemplateView.as_view(template_name="index.html"), name="home"),
    path("", include("mezzanine.urls")),
]

handler404 = "mezzanine.core.views.page_not_found"
handler500 = "mezzanine.core.views.server_error"
