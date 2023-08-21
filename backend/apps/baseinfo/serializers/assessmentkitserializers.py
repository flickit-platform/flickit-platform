from rest_framework import serializers

from assessment.models import AssessmentProject

from baseinfo.models.assessmentkitmodels import AssessmentKit, AssessmentKitDsl, AssessmentKitTag, ExpertGroup, MaturityLevel, LevelCompetence
from baseinfo.models.basemodels import AssessmentSubject
from baseinfo.serializers.commonserializers import ExpertGroupSimpleSerilizers

from ..services import assessmentkitservice


class AssessmentKitDslSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentKitDsl
        fields = ['id', 'dsl_file']

class AssessmentKitTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentKitTag
        fields = ['id', 'code', 'title']

class SimpleLevelCompetenceSerilizer(serializers.ModelSerializer):
        maturity_level_id = serializers.IntegerField(source='maturity_level_competence_id')
        class Meta:
            model   = LevelCompetence
            fields = ['id', 'value' , 'maturity_level_id']

class SimpleMaturityLevelSimpleSerializer(serializers.ModelSerializer):
    level_competences = SimpleLevelCompetenceSerilizer(many = True)
    class Meta:
        model = MaturityLevel
        fields = ['id','value','level_competences']
        
class MaturityLevelSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaturityLevel
        fields = ['id', 'title', 'value']


class AssessmentKitSerilizer(serializers.ModelSerializer):
    tags =  AssessmentKitTagSerializer(many = True)
    expert_group = ExpertGroupSimpleSerilizers()
    number_of_assessment = serializers.SerializerMethodField()
    current_user_delete_permission = serializers.SerializerMethodField()
    current_user_is_coordinator = serializers.SerializerMethodField()
    number_of_subject = serializers.SerializerMethodField()
    number_of_questionaries = serializers.SerializerMethodField()
    subjects_with_desc = serializers.SerializerMethodField()
    questionnaires = serializers.SerializerMethodField()
    likes_number = serializers.SerializerMethodField()
    maturity_levels = MaturityLevelSimpleSerializer(many = True)


    def get_number_of_assessment(self, assessment_kit: AssessmentKit):
        return AssessmentProject.objects.filter(assessment_kit_id = assessment_kit.id).count()

    def get_current_user_delete_permission(self, assessment_kit: AssessmentKit):
        return assessmentkitservice.get_current_user_delete_permission(assessment_kit, self.context.get('request', None).user.id)

    def get_current_user_is_coordinator(self, assessment_kit: AssessmentKit):
        return assessmentkitservice.get_current_user_is_coordinator(assessment_kit, self.context.get('request', None).user.id)

    def get_number_of_subject(self, assessment_kit: AssessmentKit):
        return assessment_kit.assessment_subjects.all().count()

    def get_number_of_questionaries(self, assessment_kit: AssessmentKit):
        return assessment_kit.questionnaires.all().count()

    def get_subjects_with_desc(self, assessment_kit: AssessmentKit):
        subjects = assessment_kit.assessment_subjects.values('id', 'title', 'description')
        for subject in subjects:
            subj_qs = AssessmentSubject.objects.get(id = subject['id'])
            attributes = subj_qs.quality_attributes.values('id', 'title', 'description')
            subject['attributes'] = attributes
        return subjects

    def get_questionnaires(self, assessment_kit: AssessmentKit):
        return assessment_kit.questionnaires.values('id', 'title', 'description')

    def get_likes_number(self, assessment_kit: AssessmentKit):
        return assessment_kit.likes.count()
    
    class Meta:
        model = AssessmentKit
        fields = ['id', 'code', 'title', 'summary', 'about', 'tags', 'expert_group', 
        'creation_time', 'last_modification_date', 'likes_number', 'number_of_subject', 'number_of_questionaries',
        'number_of_assessment', 'current_user_delete_permission', 'is_active', 'current_user_is_coordinator', 
        'subjects_with_desc', 'questionnaires', 'maturity_levels']

class AssessmentKitCreateSerilizer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentKit
        fields = ['id']

class ImportAssessmentKitSerializer(serializers.Serializer):
    # code = serializers.CharField()
    title = serializers.CharField()
    about = serializers.CharField()
    summary = serializers.CharField()
    tag_ids = serializers.ListField(child=serializers.IntegerField())
    expert_group_id = serializers.IntegerField()
    dsl_id = serializers.IntegerField()

class AssessmentKitInitFormSerilizer(serializers.ModelSerializer):
    tags =  AssessmentKitTagSerializer(many = True)
    class Meta:
        model = AssessmentKit
        fields = ['id', 'title', 'summary', 'about', 'tags']

class UpdateAssessmentKitSerializer(serializers.Serializer):
    title = serializers.CharField(required=False)
    about = serializers.CharField(required=False)
    summary = serializers.CharField(required=False)
    tags = serializers.ListField(child=serializers.IntegerField(),required=False)




class LevelCompetenceSerilizer(serializers.ModelSerializer):
        class Meta:
            model = LevelCompetence
            fields = ['id', 'maturity_level_id', 'value', 'maturity_level_competence_id']

class LoadAssessmentKitForExpertGroupSerilizer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentKit
        fields = ['id', 'title', 'last_modification_date']
        

class SimpleAssessmentKitTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentKitTag
        fields = ['id', 'title']
class LoadAssessmentKitInfoEditableSerilizer(serializers.ModelSerializer):
    tags =  SimpleAssessmentKitTagSerializer(many = True )
    price = serializers.SerializerMethodField('price_value')
    def price_value(self,AssessmentKit):
        return 0
    class Meta:
        model = AssessmentKit
        fields = ['id', 'title', 'summary','is_active','price', 'about', 'tags']

class SimpleExpertGroupDataForAssessmentKitSerializer(serializers.ModelSerializer):
        class Meta:
            model = ExpertGroup
            fields = ['id', 'name']

class SimpleAssessmentSubjectDataForAssessmentKitSerializer(serializers.ModelSerializer):
        class Meta:
            model = AssessmentSubject
            fields = ['title']

class LoadAssessmentKitInfoStatisticalSerilizer(serializers.ModelSerializer):
    last_update_time = serializers.DateTimeField(source='last_modification_date')
    questionnaires_count = serializers.IntegerField(source='questionnaires.count')
    attributes_count = serializers.SerializerMethodField()
    questions_count = serializers.SerializerMethodField()
    maturity_levels_count = serializers.IntegerField(source='maturity_levels.count')
    likes_count = serializers.IntegerField(source='likes.count')
    assessments_count = serializers.IntegerField(source='assessment_projects.count')
    subjects = SimpleAssessmentSubjectDataForAssessmentKitSerializer(source ='assessment_subjects' ,many = True)
    expert_group =SimpleExpertGroupDataForAssessmentKitSerializer()
    
    
    def get_attributes_count(self,assessment_kit:AssessmentKit):
        return assessment_kit.assessment_subjects.values('quality_attributes').count()
    
    def get_questions_count(self,assessment_kit:AssessmentKit):
        return assessment_kit.questionnaires.values('question').count()
    
    def get_questions_count(self,assessment_kit:AssessmentKit):
        return assessment_kit.questionnaires.values('question').count()
    
    class Meta:
        model = AssessmentKit
        fields = ['creation_time', 'last_update_time', 'questionnaires_count' , 'attributes_count', 'questions_count', 'maturity_levels_count', 'likes_count', 'assessments_count', 'subjects' ,'expert_group']