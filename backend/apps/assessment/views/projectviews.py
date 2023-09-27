from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema

from common.abstractservices import load_model

from account.models import Space
from account.permission.spaceperm import IsSpaceMember
from account.permission.spaceperm import ASSESSMENT_LIST_IDS_PARAM_NAME

from assessment.models import AssessmentProject
from assessment.serializers import projectserializers
from assessment.services import assessmentprojectservices, compareservices, assessment_core


class AssessmentProjectViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action in ('create', 'update'):
            return projectserializers.AssessmentProjecCreateSerilizer
        else:
            return projectserializers.AssessmentProjectListSerilizer

    def get_queryset(self):
        return AssessmentProject.objects.all().order_by('creation_time')


class AssessmentProjectBySpaceViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsSpaceMember]

    def get_serializer_class(self):
        return projectserializers.AssessmentProjectListSerilizer

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        requested_space = load_model(Space, self.kwargs['space_pk'])
        response.data['requested_space'] = requested_space.title
        return response

    def get_queryset(self):
        return AssessmentProject.objects.filter(space_id=self.kwargs['space_pk']).order_by('-last_modification_date')


class AssessmentProjectByCurrentUserViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = projectserializers.AssessmentProjectSimpleSerilizer

    def get_queryset(self):
        current_user_space_list = self.request.user.spaces.all()
        assessment_kit_id = self.request.query_params.get('assessment_kit_id')
        return assessmentprojectservices.extract_user_assessments(current_user_space_list, assessment_kit_id)


class AssessmentProjectSelectForCompareView(APIView):
    permission_classes = [IsAuthenticated, IsSpaceMember]

    def post(self, request):
        assessment_list_ids = request.data.get(ASSESSMENT_LIST_IDS_PARAM_NAME)
        assessment_list = compareservices.loadAssessmentsByIdsForComapre(assessment_list_ids)
        return Response(assessment_list)


class AssessmentProjectApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=projectserializers.AssessmentProjectSerializer(), responses={201: ""})
    def post(self, request):
        serializer = projectserializers.AssessmentProjectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = assessment_core.create_assessment(request.user, serializer.validated_data)
        if not result["Success"]:
            return Response(result["body"],
                            status=status.HTTP_400_BAD_REQUEST)
        if result["body"].status_code == status.HTTP_201_CREATED:
            return Response({"assessment_id": result["body"].json()['id']}, status=result["body"].status_code)
        return Response(result["body"].json(), status=result["body"].status_code)

    def get(self, request):
        result = assessment_core.get_assessment_list(request)
        return Response(result["body"], result["status_code"])