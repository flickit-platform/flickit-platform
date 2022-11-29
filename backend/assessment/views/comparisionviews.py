from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from statistics import mean
from account.permission.spaceperm import ASSESSMENT_LIST_IDS_PARAM_NAME, IsSpaceMember

from ..models import AssessmentProject
from baseinfo.models import QualityAttribute
from ..fixture.dictionary import Dictionary
from ..fixture.common import calculate_staus
from ..services.metricstatistic import extract_total_progress, extract_subject_total_progress
from ..services.attributesstatistics import extract_most_significant_weaknessness_atts, extract_most_significant_strength_atts



class CompareAssessmentView(APIView):
    # TODO check authorization
    permission_classes = [IsAuthenticated, IsSpaceMember]
    def post(self, request):
        assessment_list_ids = request.data.get(ASSESSMENT_LIST_IDS_PARAM_NAME)
        content = Dictionary()
        base_infos = []
        overall_insights = []
        subjects = []
        if not self.assessment_ids_is_valid(assessment_list_ids):
            error_message = 'No project exists with the given assessment_id'
            return Response({'message': error_message}, status=status.HTTP_404_NOT_FOUND)

        assessment_projects = self.extract_assessments(assessment_list_ids)

        # extract base info
        for assessment_project in assessment_projects:
            self.extract_base_info(base_infos, assessment_project)
        overall_insights.append(self.extract_space(assessment_projects))
        overall_insights.append(self.extract_progress(assessment_projects))
        overall_insights.append(self.extract_strength(assessment_projects))
        overall_insights.append(self.extract_weakness(assessment_projects))
        
        
        
        profile = assessment_projects[0].assessment_profile
        assessment_subjects = profile.assessment_subjects.all()
        for subject in assessment_subjects:
            subject_info = Dictionary()
            subject_report_info = []
            attributes_info = []
            subject_info.add('title', subject.title)

            maturity_level_infos, status_infos = self.extract_subject_maturity_level_info(assessment_projects, subject)
            progress_info = self.extract_subject_progress_info(assessment_projects, subject)
            weakness_info = self.extract_weakness_info(assessment_projects, subject)
            strength_info = self.extract_strength_info(assessment_projects, subject)
            confidence_infos = self.extract_subject_confidence_info(assessment_projects, subject)

            subject_report_info.append(status_infos)
            subject_report_info.append(maturity_level_infos)
            subject_report_info.append(confidence_infos)
            subject_report_info.append(progress_info)
            subject_report_info.append(strength_info)
            subject_report_info.append(weakness_info)
            
            subject_atts = subject.qualityattribute_set.all()
            for att in subject_atts:
                att_info = Dictionary()
                att_info.add('title', att.title)
                for assessment_project in assessment_projects:
                    att_value = att.quality_attribute_values.filter(assessment_result_id = assessment_project.get_assessment_result().id).first()
                    att_info.add(str(assessment_project.id), att_value.maturity_level_value)
                attributes_info.append(att_info)

            subject_info.add('subject_report_info', subject_report_info)
            subject_info.add('attributes_info', attributes_info)
            subjects.append(subject_info)

        

        content.add('base_infos', base_infos)
        content.add('overall_insights', overall_insights)
        content.add('subjects', subjects)

        



        return Response(content)

    def extract_subject_confidence_info(self, assessment_projects, subject):
        confidence_infos = Dictionary()
        confidence_infos.add('title', 'Confidence level')
        confidence_list = []
        for assessment_project in assessment_projects:
            confidence_list.append(1)
        
        confidence_infos.add('items', confidence_list)
        return confidence_infos

    def extract_strength_info(self, assessment_projects, subject):
        strength_infos = Dictionary()
        strength_infos.add('title', 'Strength')
        strength_list = []

        
        for assessment_project in assessment_projects:
            strength_list.append(self.extract_subject_strength_list_attributes(assessment_project, subject))
        
        strength_infos.add('items', strength_list)
        return strength_infos

    def extract_subject_strength_list_attributes(self, assessment_project, subject):
        att_values = self.extract_subject_attributes(assessment_project, subject)
        att_ids = [o['quality_attribute_id'] for o in att_values if o['maturity_level_value'] > 2][:2]
        return self.extract_att_titles(att_ids)

    def extract_weakness_info(self, assessment_projects, subject):
        weakness_infos = Dictionary()
        weakness_infos.add('title', 'Weakness')
        weakness_list = []

        
        for assessment_project in assessment_projects:
            weakness_list.append(self.extract_subject_weakness_attributes(assessment_project, subject))
        
        weakness_infos.add('items', weakness_list)
        return weakness_infos

    def extract_subject_weakness_attributes(self, assessment_project, subject):
        att_values = self.extract_subject_attributes(assessment_project, subject)
        att_ids = [o['quality_attribute_id'] for o in att_values  if o['maturity_level_value'] < 3][:-3:-1]
        return self.extract_att_titles(att_ids)

    def extract_att_titles(self, att_ids):
        att_titles = []
        for att_id in att_ids:
            att_titles.append(QualityAttribute.objects.get(id = att_id).title)
        return att_titles


    def extract_subject_progress_info(self, assessment_projects, subject):
        progress_infos = Dictionary()
        progress_infos.add('title', 'Progress')
        progress_list = []

        
        for assessment_project in assessment_projects:
            progress_list.append(self.calculate_subject_progress(assessment_project, subject))
        
        progress_infos.add('items', progress_list)
        return progress_infos

    def calculate_subject_progress(self, assessment_project, subject):
        return extract_subject_total_progress(assessment_project.get_assessment_result(), subject)

    def extract_subject_maturity_level_info(self, assessment_projects, subject):
        maturity_level_infos = Dictionary()
        maturity_level_infos.add('title', 'Maturity level')
        maturity_levels_list = []

        status_infos = Dictionary()
        status_infos.add('title', 'Status')
        status_list = []

        for assessment_project in assessment_projects:
            maturity_levels_list.append(self.calculate_subject_maturity_level(assessment_project, subject))
        
        for maturity_level in maturity_levels_list:
            status_list.append(calculate_staus(maturity_level))
        maturity_level_infos.add('items', maturity_levels_list)
        status_infos.add('items', status_list)
        return maturity_level_infos, status_infos

    def calculate_subject_maturity_level(self, assessment_project, subject):
        att_values = self.extract_subject_attributes(assessment_project, subject)
        return round(mean([item['maturity_level_value'] for item in att_values]))

    def extract_subject_attributes(self, assessment_project, subject):
        att_values = assessment_project.get_assessment_result() \
            .quality_attribute_values \
            .filter(quality_attribute__assessment_subject_id = subject.id).order_by('-maturity_level_value').values()
            
        return att_values

    def extract_strength(self, assessment_projects):
        strength_infos = Dictionary()
        strength_list = []
        strength_infos.add('title', 'Strength')
        for assessment_project in assessment_projects:
            strength_list.append(extract_most_significant_strength_atts(assessment_project.get_assessment_result()))
        strength_infos.add('items', strength_list)
        return strength_infos

    def extract_weakness(self, assessment_projects):
        weakness_infos = Dictionary()
        weakness_list = []
        weakness_infos.add('title', 'Weakness')
        for assessment_project in assessment_projects:
            weakness_list.append(extract_most_significant_weaknessness_atts(assessment_project.get_assessment_result()))
        weakness_infos.add('items', weakness_list)
        return weakness_infos

    def extract_space(self, assessment_projects):
        space_infos = Dictionary()
        space_list = []
        space_infos.add('title', 'Space')
        for assessment_project in assessment_projects:
            space_list.append(assessment_project.space.title)
        space_infos.add('items', space_list)
        return space_infos

    def extract_progress(self, assessment_projects):
        progress_infos = Dictionary()
        progress_list = []
        progress_infos.add('title', 'Progress')
        for assessment_project in assessment_projects:
            progress_list.append(extract_total_progress(assessment_project.get_assessment_result()))
        progress_infos.add('items', progress_list)
        return progress_infos
        

    def extract_assessments(self, assessment_list_ids):
        assessment_lists = []
        for assessment_id in assessment_list_ids:
            assessment_project = AssessmentProject.objects.load(assessment_id)
            assessment_lists.append(assessment_project)
        return assessment_lists
    
    # TODO check assessment profile is the same
    def assessment_ids_is_valid(self, assessment_list_ids):
        for assessment_id in assessment_list_ids:
            assessment_project = AssessmentProject.objects.load(assessment_id)
            if assessment_project is None:
                return False
        return True
            

    def extract_base_info(self, base_infos, assessment_project: AssessmentProject):
        base_info = Dictionary()
        base_info.add('id', assessment_project.id)
        base_info.add('title', assessment_project.title)
        base_info.add('status', assessment_project.status)
        base_info.add('profile', assessment_project.assessment_profile.title)
        base_infos.append(base_info)

            

        

            