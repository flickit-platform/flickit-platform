from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from common.abstractservices import load_model

from account.models import Space
from account.permission.spaceperm import IsSpaceMember
from account.permission.spaceperm import ASSESSMENT_LIST_IDS_PARAM_NAME

from assessment.models import AssessmentProject
from assessment.serializers import projectserializers 
from assessment.services import assessmentprojectservices

class AssessmentProjectViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action in ('create', 'update'):
            return projectserializers.AssessmentProjecCreateSerilizer   
        else:
            return projectserializers.AssessmentProjectListSerilizer

    def get_queryset(self):
        return AssessmentProject.objects.all().order_by('creation_time')

class AssessmentProjectBySpaceViewSet(ModelViewSet):
    permission_classes=[IsAuthenticated, IsSpaceMember]
    def get_serializer_class(self):
        return projectserializers.AssessmentProjectListSerilizer

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        requested_space = load_model(Space, self.kwargs['space_pk'])
        response.data['requested_space'] = requested_space.title
        return response       

    def get_queryset(self):
        return AssessmentProject.objects.filter(space_id=self.kwargs['space_pk'])

class AssessmentProjectByCurrentUserViewSet(ModelViewSet):
    permission_classes=[IsAuthenticated]
    serializer_class = projectserializers.AssessmentProjectSimpleSerilizer

    def get_queryset(self):
        current_user_space_list = self.request.user.spaces.all()
        profile_id = self.request.query_params.get('profile_id')
        return assessmentprojectservices.extract_user_assessments(current_user_space_list, profile_id)

class AssessmentProjectSelectForCompareView(APIView):
    permission_classes=[IsAuthenticated, IsSpaceMember]
    def post(self, request):
        assessment_list_ids = request.data.get(ASSESSMENT_LIST_IDS_PARAM_NAME)
        assessment_list = assessmentprojectservices.loadAssessmentsByIds(assessment_list_ids)
        return Response(assessment_list)
