from django.urls import path
from rest_framework_nested import routers

from baseinfo.views import commonviews
from baseinfo.views import assessmentkitviews, importassessmentkitviews
from baseinfo.views import expertgroupviews




router = routers.DefaultRouter()
router.register('assessmentkits', assessmentkitviews.AssessmentKitViewSet, basename='assessmentkits')
router.register('questionnaires', commonviews.QuestionnaireViewSet, basename='questionnaires')
router.register('subjects', commonviews.AssessmentSubjectViewSet, basename='subjects')
router.register('attributes', commonviews.QualityAttributeViewSet, basename='attributes')
router.register('dsl', assessmentkitviews.UploadAssessmentKitApi, basename='dsl')
router.register('tags', assessmentkitviews.AssessmentKitTagViewSet, basename='tags')
router.register('expertgroups', expertgroupviews.ExpertGroupViewSet, basename='expertgroups')


questionnaire_router = routers.NestedDefaultRouter(router, 'questionnaires', lookup='questionnaire')
questionnaire_router.register('questions', commonviews.QuestionViewSet, basename='questionnaire-questions')

expert_group_access_router = routers.NestedDefaultRouter(router, 'expertgroups', lookup='expertgroup')
expert_group_access_router.register('expertgroupaccess', expertgroupviews.ExpertGroupAccessViewSet, basename='expertgroup-user-access')

questionnaire_by_subject_router = routers.NestedDefaultRouter(router, 'subjects', lookup='assessment_subject')
questionnaire_by_subject_router.register('questionnaires', commonviews.QuestionnaireBySubjectViewSet, basename='subject-questionnaires')


urlpatterns = router.urls + questionnaire_router.urls + questionnaire_by_subject_router.urls  + expert_group_access_router.urls

urlpatterns += [
    path("inspectassessmentkit/<str:assessment_kit_id>/", assessmentkitviews.AssessmentKitDetailDisplayApi.as_view()),
    path("analyzeassessmentkit/<str:assessment_kit_id>/", assessmentkitviews.AssessmentKitAnalyzeApi.as_view()),
    path("expertgroup/<str:expert_group_id>/assessmentkits/", assessmentkitviews.AssessmentKitListForExpertGroupApi.as_view()),
    path("userexpertgroup/", expertgroupviews.UserExpertGroupsApiView.as_view()),
    path("addexpertgroup/<str:expert_group_id>/", expertgroupviews.AddUserToExpertGroupApi.as_view()),
    path("expertgroup/confirm/<str:token>/", expertgroupviews.ConfirmUserForExpertGroupApi.as_view()),
    path("importassessmentkit/", importassessmentkitviews.ImportAssessmentKitApi.as_view()),
    path("assessmentkits/archive/<str:assessment_kit_id>/", assessmentkitviews.AssessmentKitArchiveApi.as_view()),
    path("assessmentkits/publish/<str:assessment_kit_id>/", assessmentkitviews.AssessmentKitPublishApi.as_view()),
    path("assessmentkits/like/<str:assessment_kit_id>/", assessmentkitviews.AssessmentKitLikeApi.as_view()),
    path("assessmentkits/options/select/", assessmentkitviews.AssessmentKitListOptionsApi.as_view()),
    path("assessmentkits/update/<str:assessment_kit_id>/", assessmentkitviews.UpdateAssessmentKitApi.as_view()),
    path("assessmentkits/get/<str:assessment_kit_id>/", assessmentkitviews.AssessmentKitInitFormApi.as_view()),
]