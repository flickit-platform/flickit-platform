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

    def get(self, request):
        result = assessment_core.get_assessment_list(request)
        return Response(result["body"], result["status_code"])


class AssessmentApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=openapi.Schema(type=openapi.TYPE_OBJECT), responses={201: ""})
    def put(self, request, assessment_id):
        result = assessment_core.edit_assessment(request, assessment_id)
        return Response(result["body"], result["status_code"])

    def delete(self, request, assessment_id):
        result = assessment_services.assessment_delete(request, assessment_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])
