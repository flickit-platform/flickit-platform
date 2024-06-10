from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet
from drf_yasg.utils import swagger_auto_schema

from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated, AllowAny

from baseinfo.services import assessmentkitservice, dsl_services, assessment_kit_service
from baseinfo.serializers.assessmentkitserializers import *
from baseinfo.models.assessmentkitmodels import AssessmentKitDsl, AssessmentKitTag, AssessmentKit
from baseinfo.permissions import IsMemberExpertGroup, IsOwnerExpertGroup


class AssessmentKitListForExpertGroupApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, expert_group_id):
        results = assessmentkitservice.get_list_assessment_kit_for_expert_group(request.user, expert_group_id)
        if len(results) == 2:
            published = LoadAssessmentKitForExpertGroupSerilizer(results["published"], many=True).data
            unpublished = LoadAssessmentKitForExpertGroupSerilizer(results["unpublished"], many=True).data
            return Response({'results': {"published": published, "unpublished": unpublished}},
                            status=status.HTTP_200_OK)
        else:
            published = LoadAssessmentKitForExpertGroupSerilizer(results["published"], many=True).data
            return Response({'results': {"published": published}}, status=status.HTTP_200_OK)


class AssessmentKitListOptionsApi(APIView):
    def get(self, request):
        assessment_kit_options = AssessmentKit.objects.filter(is_active=True).values('id', 'title')
        return Response({'results': assessment_kit_options})


class AssessmentKitTagViewSet(ModelViewSet):
    serializer_class = AssessmentKitTagSerializer

    def get_queryset(self):
        return AssessmentKitTag.objects.all()


class AssessmentKitLikeApi(APIView):
    @transaction.atomic
    def post(self, request, assessment_kit_id):
        assessment_kit = assessmentkitservice.like_assessment_kit(request.user, assessment_kit_id)
        return Response({'likes': assessment_kit.likes.count()})


class LoadAssessmentKitInfoEditableApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(responses={200: LoadAssessmentKitInfoEditableSerilizer(many=True)})
    def get(self, request, assessment_kit_id):
        if not ExpertGroup.objects.filter(assessmentkits=assessment_kit_id).filter(users=request.user.id).exists():
            return Response({"code": "NOT_FOUND", 'message': "'assessment_kit_id' does not exist"},
                            status=status.HTTP_400_BAD_REQUEST)
        assessment_kit = assessmentkitservice.get_assessment_kit(assessment_kit_id)
        response = LoadAssessmentKitInfoEditableSerilizer(assessment_kit, many=True, context={'request': request}).data
        return Response(response[0], status=status.HTTP_200_OK)


class EditAssessmentKitInfoApi(APIView):
    serializer_class = EditAssessmentKitInfoSerializer

    def get_permissions(self):
        permission_classes = [IsAuthenticated]
        if self.request.method == 'PATCH':
            permission_classes = [IsAuthenticated, IsOwnerExpertGroup]
        return [permission() for permission in permission_classes]

    def get(self, request, assessment_kit_id):
        result = assessment_kit_service.get_assessment_kit_publish(request, assessment_kit_id)
        return Response(data=result["body"], status=result["status_code"])

    @swagger_auto_schema(request_body=EditAssessmentKitInfoSerializer(),
                         responses={200: LoadAssessmentKitInfoEditableSerilizer(many=True)})
    def patch(self, request, assessment_kit_id):
        if "data" in request.data:
            serializer = EditAssessmentKitInfoSerializer(data=request.data["data"], context={'request': request})
            serializer.is_valid(raise_exception=True)
            result = assessmentkitservice.update_assessment_kit_info(assessment_kit_id, **serializer.validated_data)
            if not result.success:
                return Response({'message': result.message}, status=status.HTTP_400_BAD_REQUEST)
        assessment_kit = assessmentkitservice.get_assessment_kit(assessment_kit_id)
        response = LoadAssessmentKitInfoEditableSerilizer(assessment_kit, many=True, context={'request': request}).data
        return Response(response[0], status=status.HTTP_200_OK)


class LoadMaturityLevelApi(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(responses={200: SimpleMaturityLevelSimpleSerializer(many=True)})
    def get(self, request, assessment_kit_id):
        maturity_level = assessmentkitservice.get_maturity_level_with_assessment_kit(assessment_kit_id)
        if not maturity_level:
            return Response({"code": "NOT_FOUND", 'message': "'assessment_kit_id' does not exist"},
                            status=status.HTTP_400_BAD_REQUEST)
        response = SimpleMaturityLevelSimpleSerializer(maturity_level, many=True).data
        return Response({'items': response}, status=status.HTTP_200_OK)


class LoadAssessmentKitDetailsApi(APIView):
    permission_classes = [IsAuthenticated, IsMemberExpertGroup]

    @swagger_auto_schema(responses={200: LoadAssessmentKitDetailsSerializer(many=True)})
    def get(self, request, assessment_kit_id):
        assessment_kit = assessmentkitservice.get_assessment_kit(assessment_kit_id)
        response = LoadAssessmentKitDetailsSerializer(assessment_kit, many=True).data
        return Response(response[0], status=status.HTTP_200_OK)


class LoadAssessmentKitFileApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_kit_id):
        result = dsl_services.download_dsl_assessment(assessment_kit_id=assessment_kit_id, request=request)
        return Response(data=result["body"], status=result["status_code"])
