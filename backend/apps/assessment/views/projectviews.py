from drf_yasg import openapi
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from assessment.serializers import projectserializers
from assessment.services import assessment_core, assessment_core_services, assessment_services


class AssessmentProjectApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=projectserializers.AssessmentProjectSerializer(), responses={201: ""})
    def post(self, request):
        serializer = projectserializers.AssessmentProjectSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = assessment_core.create_assessment(request.user, serializer.validated_data,
                                                   authorization_header=request.headers['Authorization'])
        if not result["Success"]:
            return Response(result["body"],
                            status=status.HTTP_400_BAD_REQUEST)
        if result["body"].status_code == status.HTTP_201_CREATED:
            return Response({"assessment_id": result["body"].json()['id']}, status=result["body"].status_code)
        return Response(result["body"].json(), status=result["body"].status_code)

    space_id_param = openapi.Parameter('spaceId', openapi.IN_QUERY, description="space id param",
                                       type=openapi.TYPE_INTEGER)
    kit_id_param = openapi.Parameter('kitId', openapi.IN_QUERY, description="kit id param",
                                     type=openapi.TYPE_INTEGER)
    size_param = openapi.Parameter('size', openapi.IN_QUERY, description="size param",
                                   type=openapi.TYPE_INTEGER)
    page_param = openapi.Parameter('page', openapi.IN_QUERY, description="page param",
                                   type=openapi.TYPE_INTEGER)

    @swagger_auto_schema(manual_parameters=[space_id_param, kit_id_param, size_param, page_param])
    def get(self, request):
        result = assessment_services.list_assessments(request)
        return Response(result["body"], result["status_code"])


class AssessmentApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id):
        result = assessment_services.load_assessment(request, assessment_id)
        return Response(result["body"], result["status_code"])

    @swagger_auto_schema(request_body=projectserializers.EditAssessmentSerializer(), responses={201: ""})
    def put(self, request, assessment_id):
        serializer = projectserializers.EditAssessmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        assessments_details = assessment_core_services.load_assessment_details_with_id(request, assessment_id)
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        result = assessment_core.edit_assessment(assessments_details["body"], serializer.validated_data,
                                                 authorization_header=request.headers['Authorization'])
        return Response(result["body"], result["status_code"])

    def delete(self, request, assessment_id):
        result = assessment_services.assessment_delete(request, assessment_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])
