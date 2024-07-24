from django.urls import path
from rest_framework_nested import routers

from baseinfo.views import commonviews
from baseinfo.views import assessmentkitviews, importassessmentkitviews
from baseinfo.views import expertgroupviews

router = routers.DefaultRouter()

urlpatterns = [
    path("assessmentkits/options/select/", assessmentkitviews.AssessmentKitListOptionsApi.as_view()),
]
