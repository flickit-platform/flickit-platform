from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from baseinfo.services import assessment_kit_service


class AssessmentKitStateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_kit_id):
        result = assessment_kit_service.get_assessment_kit_state(request, assessment_kit_id)
        return Response(data=result["body"], status=result["status_code"])


class AssessmentKitInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_kit_id):
        result = assessment_kit_service.get_assessment_kit_info(request, assessment_kit_id)
        return Response(data=result["body"], status=result["status_code"])


class AssessmentKitView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, assessment_kit_id):
        result = assessment_kit_service.update_assessment_kit(request, assessment_kit_id)
        if result["Success"]:
            return Response(status=result["status_code"])
        return Response(data=result["body"], status=result["status_code"])


class AssessmentKitDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_kit_id):
        result = assessment_kit_service.get_assessment_kit_details(request, assessment_kit_id)
        return Response(data=result["body"], status=result["status_code"])


class AssessmentKitDetailsSubjectView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_kit_id, subject_id):
        result = assessment_kit_service.get_assessment_kit_details_subjects(request, assessment_kit_id, subject_id)
        return Response(data=result["body"], status=result["status_code"])
