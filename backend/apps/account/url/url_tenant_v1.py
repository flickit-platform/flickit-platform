from django.urls import path

from account.views.tenant_views import TenantInfoApi, TenantLogoApi

urlpatterns = [
    path("info/", TenantInfoApi.as_view()),
    path("logo/", TenantLogoApi.as_view()),
]
