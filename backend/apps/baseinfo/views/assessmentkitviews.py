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

from rest_framework.exceptions import PermissionDenied

from baseinfo.decorators import is_expert
from baseinfo.services import assessmentkitservice, expertgroupservice, commonservice
from baseinfo.serializers.assessmentkitserializers import *
from baseinfo.models.assessmentkitmodels import AssessmentKitDsl, AssessmentKitTag, AssessmentKit
from baseinfo.permissions import ManageExpertGroupPermission, ManageAssessmentKitPermission

class AssessmentKitViewSet(mixins.RetrieveModelMixin,
                   mixins.DestroyModelMixin,
                   mixins.ListModelMixin,
                   GenericViewSet):
    serializer_class = AssessmentKitSerilizer
    filter_backends=[DjangoFilterBackend, SearchFilter]
    permission_classes = [IsAuthenticated, ManageAssessmentKitPermission]
    search_fields = ['title']

    def get_queryset(self):
        if self.action == 'list':
            return AssessmentKit.objects.filter(is_active = True)
        return AssessmentKit.objects.all()

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        result = assessmentkitservice.is_assessment_kit_deletable(kwargs['pk'])
        if result.success:
            return super().destroy(request, *args, ** kwargs)
        else:
            return Response({'message': result.message}, status=status.HTTP_400_BAD_REQUEST)
        

class AssessmentKitDetailDisplayApi(APIView):
    permission_classes = [IsAuthenticated, ManageAssessmentKitPermission]
    def get(self, request, assessment_kit_id):
        assessment_kit = assessmentkitservice.load_assessment_kit(assessment_kit_id)
        response = assessmentkitservice.extract_detail_of_assessment_kit(assessment_kit, request)
        return Response(response, status = status.HTTP_200_OK)

class AssessmentKitAnalyzeApi(APIView):
    permission_classes = [IsAuthenticated, ManageAssessmentKitPermission]
    def get(self, request, assessment_kit_id):
        result = assessmentkitservice.analyze(assessment_kit_id)
        return Response(result.data, status = status.HTTP_200_OK)

class AssessmentKitListForExpertGroupApi(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, expert_group_id):
        results = assessmentkitservice.get_list_assessmnet_kit_for_expert_group(request.user, expert_group_id)
        if len(results) == 2:
            published = LodeAssessmentKitForExpertGroupSerilizer(results["published"], many = True).data
            unpublished = LodeAssessmentKitForExpertGroupSerilizer(results["unpublished"], many = True).data
            return Response({'results' : [{"published" :published},{"unpublished" :unpublished}]}, status = status.HTTP_200_OK)
        else:
            published = LodeAssessmentKitForExpertGroupSerilizer(results["published"], many = True).data
            return Response({'results' : [{"published" :published}]}, status = status.HTTP_200_OK)
        
class AssessmentKitListApi(APIView):
    permission_classes = [IsAuthenticated]
    @is_expert
    def get(self, request, expert_group_id):
        expert_group = expertgroupservice.load_expert_group(expert_group_id)
        response = AssessmentKitSerilizer(expert_group.assessmentkits.filter(is_active=True), many = True, context={'request': request}).data
        return Response({'results' : response}, status = status.HTTP_200_OK)
    
class UnpublishedAssessmentKitListApi(APIView):
    permission_classes = [IsAuthenticated]
    @is_expert
    def get(self, request, expert_group_id):
        expert_group = expertgroupservice.load_expert_group(expert_group_id)
        if not expert_group.users.filter(id = request.user.id).exists():
            raise PermissionDenied
        response = AssessmentKitSerilizer(expert_group.assessmentkits.filter(is_active=False), many = True, context={'request': request}).data
        return Response({'results' : response}, status = status.HTTP_200_OK)

class AssessmentKitListOptionsApi(APIView):
    def get(self, request):
        assessment_kit_options =  AssessmentKit.objects.filter(is_active = True).values('id', 'title')
        return Response({'results': assessment_kit_options})

class AssessmentKitArchiveApi(APIView):
    permission_classes = [IsAuthenticated, ManageAssessmentKitPermission]
    def post(self, request, assessment_kit_id):
        assessment_kit = assessmentkitservice.load_assessment_kit(assessment_kit_id)
        result = assessmentkitservice.archive_assessment_kit(assessment_kit)
        if not result.success:
            return Response({'message': result.message}, status=status.HTTP_400_BAD_REQUEST) 
        return Response({'message': result.message})

class AssessmentKitPublishApi(APIView):
    permission_classes = [IsAuthenticated, ManageAssessmentKitPermission]
    def post(self, request, assessment_kit_id):
        assessment_kit = assessmentkitservice.load_assessment_kit(assessment_kit_id)
        result = assessmentkitservice.publish_assessment_kit(assessment_kit)
        if not result.success:
            return Response({'message': result.message}, status=status.HTTP_400_BAD_REQUEST) 
        return Response({'message': result.message})

class AssessmentKitTagViewSet(ModelViewSet):
    serializer_class = AssessmentKitTagSerializer
    def get_queryset(self):
        return AssessmentKitTag.objects.all()
    
class UploadAssessmentKitApi(ModelViewSet):
    serializer_class = AssessmentKitDslSerializer

    def get_queryset(self):
        return AssessmentKitDsl.objects.all()

class AssessmentKitLikeApi(APIView):
    @transaction.atomic
    def post(self, request, assessment_kit_id):
        assessment_kit = assessmentkitservice.like_assessment_kit(request.user, assessment_kit_id)
        return Response({'likes': assessment_kit.likes.count()})

class AssessmentKitInitFormApi(APIView):
    permission_classes = [IsAuthenticated, ManageAssessmentKitPermission]
    def get(self, request, assessment_kit_id):
        assessment_kit = assessmentkitservice.load_assessment_kit(assessment_kit_id)
        data = assessmentkitservice.get_extrac_assessment_kit_data(assessment_kit ,request)
        response = AssessmentKitInitFormSerilizer(data, many = True, context={'request': request}).data      
        return Response(response, status = status.HTTP_200_OK)


class UpdateAssessmentKitApi(APIView):
    serializer_class = UpdateAssessmentKitSerializer
    permission_classes = [IsAuthenticated, ManageAssessmentKitPermission]
    def post(self, request, assessment_kit_id):
        serializer = UpdateAssessmentKitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        assessment_kit = assessmentkitservice.load_assessment_kit(assessment_kit_id)
        result = assessmentkitservice.update_assessment_kit(assessment_kit ,request,**serializer.validated_data)
        if result.success:
            return Response({'message': result.message})
        else:
            return Response({'message': result.message}, status=status.HTTP_400_BAD_REQUEST)


class LoadLevelCompetenceInternalApi(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(responses={200: LevelCompetenceSerilizer(many=True)})
    def get(self,request,maturity_level_id):
        level_competence = assessmentkitservice.get_level_competence_with_maturity_level(maturity_level_id)
        response = LevelCompetenceSerilizer(level_competence, many = True).data
        return Response({'items' :response}, status = status.HTTP_200_OK)  

class LoadMaturityLevelInternalApi(APIView):
    permission_classes = [AllowAny]
    @swagger_auto_schema(responses={200: MaturityLevelSimpleSerializer(many=True)})
    def get(self,request,assessment_kit_id):
        maturity_level = assessmentkitservice.get_maturity_level_with_assessment_kit(assessment_kit_id)
        response = MaturityLevelSimpleSerializer(maturity_level, many = True).data
        return Response({'items' :response}, status = status.HTTP_200_OK)  
