from django.urls import path

from baseinfo.views import commonviews
from baseinfo.views import assessmentkitviews

urlpatterns = [


    path("v1/answer-options/", commonviews.LoadAnswerOptionWithlistIdInternalApi.as_view()),

]
