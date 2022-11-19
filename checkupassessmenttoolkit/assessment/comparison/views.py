from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.mixins import status

from ..models import AssessmentProject
from ..project.serializers import AssessmentProjectSimpleSerilizer
from assessmentcore.permission.spaceperm import IsSpaceMember



# class CompareAssessmentView(APIView):
#     # TODO check authorization
#     def post(self, request):
#         assessment_list_ids = request.data.get('assessment_list_ids')
#         print(len(assessment_list_ids))
#         return Response()

class ComparisionSaveView(APIView):
    permission_classes = [IsAuthenticated, IsSpaceMember]
    def get(self, request,assessment_project_id):
        user_id = request.user.id
        if 'comparision_dict' not in request.session:
            self.init_session_for_campare_assessment(request)
        comparision_dict = request.session['comparision_dict']
        assessment_project_compare_list = self.make_compare_list(assessment_project_id, user_id, comparision_dict)
        comparision_dict[str(user_id)] = assessment_project_compare_list
        request.session['comparision_dict'] = comparision_dict
        return Response(status=status.HTTP_200_OK)

    def make_compare_list(self, assessment_project_id, user_id, comparision_dict):
        assessment_project_compare_list = comparision_dict.get(str(user_id))
        if assessment_project_compare_list is not None:
            assessment_project_compare_list.append(assessment_project_id)
        else:
            assessment_project_compare_list = []
            assessment_project_compare_list.append(assessment_project_id)
        return assessment_project_compare_list

    def init_session_for_campare_assessment(self, request):
        assessment_project_compare_list = []
        comparision_dict = {}
        comparision_dict[str(request.user.id)] = assessment_project_compare_list
        request.session['comparision_dict'] = comparision_dict

class ComparisionLoadView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        content = {}
        if 'comparision_dict' not in request.session:
            content['assessment_project_compare_list'] = []
            return Response(content)   
        
        comparision_dict = request.session['comparision_dict']
        assessment_project_compare_list = comparision_dict.get(str(request.user.id))
        assessment_list = []
        for assessment_id in assessment_project_compare_list:
            load_assessment = AssessmentProject.objects.get(id = assessment_id)
            serilizers = AssessmentProjectSimpleSerilizer(load_assessment)
            assessment_list.append(serilizers.data)
        content['assessment_project_compare_list'] = assessment_list
        return Response(assessment_list)   
            