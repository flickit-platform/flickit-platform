from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from common.abstractservices import load_model
from account.permission.spaceperm import IsSpaceMember

from assessment.models import AssessmentProject
from assessment.services import questionnaireservices, attributeservices, assessment_core


class QuestionaryBaseInfoApi(APIView):
    permission_classes = [IsAuthenticated, IsSpaceMember]

    def get(self, request, assessment_project_id):
        assessment_project = load_model(AssessmentProject, assessment_project_id)
        content = {}
        content['subjects'] = assessment_project.assessment_kit.assessment_subjects.values('id', 'title')
        content['assessment_title'] = assessment_project.title
        return Response(content)


class QuestionaryView(APIView):
    permission_classes = [IsAuthenticated, IsSpaceMember]

    def get(self, request, assessment_project_id):
        assessment_project = load_model(AssessmentProject, assessment_project_id)
        result_id = assessment_project.get_assessment_result().id
        subject_id = request.query_params.get("subject_pk", None)
        content = {}

        if not attributeservices.is_qulaity_attribute_value_exists(result_id):
            attributeservices.init_quality_attribute_value(result_id)
        questionnaire_report_info = questionnaireservices.extract_questionnaire_report_info(subject_id,
                                                                                            assessment_project,
                                                                                            result_id)
        content['questionaries_info'] = questionnaire_report_info.questionnaires_info
        questionnaireservices.calculate_total_progress(questionnaire_report_info, content)
        return Response(content)


class LoadQuestionnairesWithAssessmentApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, assessment_id):
        assessments_details = assessment_core.load_assessment_details_with_id(request, assessment_id)
        if not assessments_details["Success"]:
            return Response(assessments_details["body"], assessments_details["status_code"])
        result = assessment_core.get_questionnaires_in_assessment(assessments_details["body"])
        return Response(result["body"], result["status_code"])

