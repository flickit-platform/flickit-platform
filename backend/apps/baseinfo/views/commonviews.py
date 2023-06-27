from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from baseinfo.models.basemodels import AssessmentSubject, Questionnaire, QualityAttribute
from baseinfo.models.metricmodels import Metric, OptionValue
from baseinfo.serializers import commonserializers
from baseinfo.services import commonservice, profileservice



class QuestionnaireViewSet(ModelViewSet):
    serializer_class = commonserializers.QuestionnaireSerializer

    def get_queryset(self):
        return Questionnaire.objects.all()


class MetricViewSet(ModelViewSet):
    serializer_class = commonserializers.MetricSerilizer
    def get_queryset(self):
        return Metric.objects.filter(questionnaire_id=self.kwargs['questionnaire_pk']).order_by('index')


class QuestionnaireBySubjectViewSet(ModelViewSet):
    serializer_class = commonserializers.QuestionnaireBySubjectSerilizer
    def get_queryset(self):
        return Questionnaire.objects.prefetch_related('assessment_subjects').filter(assessment_subjects__id=self.kwargs['assessment_subject_pk']).order_by('index')


class AssessmentSubjectViewSet(ModelViewSet):
    serializer_class = commonserializers.AssessmentSubjectSerilizer

    def get_queryset(self):
        return AssessmentSubject.objects.all().order_by('index')


class QualityAttributeViewSet(ModelViewSet):
    serializer_class = commonserializers.QualityAttributeSerilizer

    def get_queryset(self):
        if 'assessment_subject_pk' in self.kwargs:
            return QualityAttribute.objects.filter(assessment_subject_id=self.kwargs['assessment_subject_pk']).order_by('index');
        else:
            return QualityAttribute.objects.all().order_by('index')
            

class LoadAssessmentSubjectApi(APIView):
    def get(self,request,profile_id):
        profile = profileservice.load_profile(profile_id)
        response = commonserializers.AssessmentSubjectSerilizer(AssessmentSubject.objects.filter(assessment_profile=profile_id).values(), many = True, context={'request': request}).data
        return Response(response, status = status.HTTP_200_OK)
    
    
class LoadOptionValueApi(APIView):
    def get(self,request,answer_tamplate_id):
        answer_tamplate = commonservice.load_answer_tamplate(answer_tamplate_id)
        response = commonserializers.OptionValueSerilizers(OptionValue.objects.filter(option=answer_tamplate_id), many = True, context={'request': request}).data
        return Response(response, status = status.HTTP_200_OK)


class LoadQualityAttributeApi(APIView):
    def get(self,request,assessment_subject_id):
        assessment_subject = commonservice.load_assessment_subject(assessment_subject_id)
        response = commonserializers.LoadQualityAttributeSerilizer(QualityAttribute.objects.filter(assessment_subject=assessment_subject_id), many = True, context={'request': request}).data
        return Response(response, status = status.HTTP_200_OK)    


class LoadMetricApi(APIView):
    def get(self,request,quality_attribute_id):
        quality_attribute = commonservice.load_quality_attribute(quality_attribute_id)
        response = commonserializers.SimpleMetricSerializers(Metric.objects.filter(quality_attributes=quality_attribute_id), many = True, context={'request': request}).data
        return Response(response, status = status.HTTP_200_OK)  
    
class LoadAssessmentSubjectAndQualityAttributeApi(APIView):
    serializer_class = commonserializers.LoadAssessmentSubjectAndQualityAttributeSerilizer
    def get(self,request,profile_id):
        profile = profileservice.load_profile(profile_id)
        data = commonservice.export_assessment_id_and_quality_attribute_id(profile)
        serializer = commonserializers.LoadAssessmentSubjectAndQualityAttributeSerilizer(data=data)
        serializer.is_valid()
        response = serializer.validated_data
        # response = commonserializers.LoadAssessmentSubjectAndQualityAttributeSerilizer(data, many = True).data
        return Response(response, status = status.HTTP_200_OK)