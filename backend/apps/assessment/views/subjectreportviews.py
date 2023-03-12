from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from account.permission.spaceperm import IsSpaceMember

from assessment.serializers.subjectreportserializers import SubjectReportSerializer
from assessment.models import QualityAttributeValue
from assessment.services import subjectreportservices, attributeservices

class SubjectReportViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated, IsSpaceMember]

    def get_serializer_class(self):
        return SubjectReportSerializer

    def get_queryset(self):
        result_id = self.request.query_params.get('assessment_result_pk')
        if attributeservices.is_qulaity_attribute_value_exists(result_id) == False:
            attributeservices.init_quality_attribute_value(result_id)

        query_set = QualityAttributeValue.objects.all()

        # filter attribute report by given subject
        # TODO make subject in query-param required and validate it
        if('assessment_subject_pk' in self.request.query_params):
            subject_id = self.request.query_params.get('assessment_subject_pk')
            return query_set.filter(quality_attribute__assessment_subject_id = subject_id) \
                            .filter(assessment_result_id = result_id) \
                            .order_by('-maturity_level_value')
        return query_set

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        quality_attribute_values = response.data['results']
        assessment_subject_pk = request.query_params.get('assessment_subject_pk')
        assessment_result_pk = request.query_params.get('assessment_result_pk')
        result = subjectreportservices.calculate_report(assessment_subject_pk, assessment_result_pk, quality_attribute_values)
        response.data.update(result.data)
        return response