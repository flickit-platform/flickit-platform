from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


from baseinfo.services import update_assessment_kit_service
from baseinfo.serializers.assessmentkitserializers import AssessmentKitUpdateSerializer
from baseinfo.permissions import IsMemberExpertGroup, IsOwnerExpertGroup


class AssessmentKitUpdateApi(APIView):
    serializer_class = AssessmentKitUpdateSerializer
    permission_classes = [IsAuthenticated, IsOwnerExpertGroup]

    @swagger_auto_schema(request_body=AssessmentKitUpdateSerializer())
    def put(self, request, assessment_kit_id):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = update_assessment_kit_service.dsl_parser_update(assessment_kit_id, serializer.validated_data['dsl_id'])
        return Response(data=result["body"], status=result["status_code"])

