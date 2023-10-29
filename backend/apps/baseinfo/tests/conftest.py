import zipfile
import os
import pytest
from model_bakery import baker
from rest_framework.test import APIClient
from account.models import User, Space, UserAccess
from baseinfo.models.assessmentkitmodels import AssessmentKitTag, AssessmentKitDsl, LevelCompetence, MaturityLevel, \
    AssessmentKit
from baseinfo.models.basemodels import AssessmentSubject, Questionnaire, QualityAttribute
from baseinfo.models.questionmodels import Question, QuestionImpact, OptionValue, AnswerTemplate
from django.core.files.uploadedfile import SimpleUploadedFile


class Dictionary(dict):

    # __init__ function
    def __init__(self):
        self = dict()

    # Function to add key:value
    def add(self, key, value):
        self[key] = value

    def get(self, key):
        return self[key]


@pytest.fixture(scope="session")
def tmp_dir(tmpdir_factory):
    tmp_dir = tmpdir_factory.mktemp("src")
    return tmp_dir


@pytest.fixture
def create_dsl_file():
    def do_create_dsl_file(filename, tmp_dir):
        zip = zipfile.ZipFile(os.path.join(tmp_dir.dirname, filename), "w", zipfile.ZIP_DEFLATED)
        zip.close()
        return os.path.basename(zip.filename)

    return do_create_dsl_file


@pytest.fixture
def create_dsl():
    def do_create_dsl(file_path, assessment_kit, tmp_dir):
        dsl = AssessmentKitDsl()
        file = open(os.path.join(tmp_dir.dirname, file_path), 'rb')
        dsl.dsl_file = SimpleUploadedFile(file.name, file.read())
        dsl.assessment_kit = assessment_kit
        dsl.save()
        return dsl

    return do_create_dsl


@pytest.fixture
def create_user():
    def do_create_user(email):
        user = baker.make(User, email=email)
        return user

    return do_create_user


@pytest.fixture
def create_assessment_kit():
    def do_create_assessment_kit(assessmentkit):
        assessment_kit = baker.make(assessmentkit)
        return assessment_kit

    return do_create_assessment_kit


@pytest.fixture
def create_expertgroup():
    def do_create_expertgroup(expertgroup, user):
        expert_group = baker.make(expertgroup, owner=user)
        expert_group.users.add(user)
        return expert_group

    return do_create_expertgroup


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticate(api_client):
    def do_authenticate(is_staff=False):
        space1 = baker.make(Space)
        user1 = baker.make(User, current_space=space1, email='test@test.com')
        user_access11 = baker.make(UserAccess, space=space1, user=user1)
        return api_client.force_authenticate(user1)

    return do_authenticate


@pytest.fixture
def create_tag():
    def do_create_tag(code, title):
        tag = baker.make(AssessmentKitTag, code=code, title=title)
        return tag

    return do_create_tag


@pytest.fixture
def init_data():
    def do_init_data():
        assessment_kit = AssessmentKit.objects.filter(title="p1").first()
        if assessment_kit == None:
            assessment_kit = baker.make(AssessmentKit)
        questionnaire_list = []
        questionnaire_list.append(baker.make(Questionnaire, assessment_kit=assessment_kit, index=1, title='c1'))
        questionnaire_list.append(baker.make(Questionnaire, assessment_kit=assessment_kit, index=2, title='c2'))
        questionnaire_list.append(baker.make(Questionnaire, assessment_kit=assessment_kit, index=3, title='c3'))
        questionnaire_list.append(baker.make(Questionnaire, assessment_kit=assessment_kit, index=4, title='c4'))

        questions_list = []
        questions_list.append(baker.make(Question, questionnaire=questionnaire_list[0], index=1))
        questions_list.append(baker.make(Question, questionnaire=questionnaire_list[0], index=2))
        questions_list.append(baker.make(Question, questionnaire=questionnaire_list[0], index=3))

        questions_list.append(baker.make(Question, questionnaire=questionnaire_list[1], index=1))
        questions_list.append(baker.make(Question, questionnaire=questionnaire_list[1], index=2))
        questions_list.append(baker.make(Question, questionnaire=questionnaire_list[1], index=3))

        questions_list.append(baker.make(Question, questionnaire=questionnaire_list[2], index=1))
        questions_list.append(baker.make(Question, questionnaire=questionnaire_list[2], index=2))
        questions_list.append(baker.make(Question, questionnaire=questionnaire_list[2], index=3))

        questions_list.append(baker.make(Question, questionnaire=questionnaire_list[3], index=1))
        questions_list.append(baker.make(Question, questionnaire=questionnaire_list[3], index=2))

        subject1 = baker.make(AssessmentSubject, assessment_kit=assessment_kit,
                              questionnaires=[questionnaire_list[0], questionnaire_list[1]])
        subject2 = baker.make(AssessmentSubject, assessment_kit=assessment_kit,
                              questionnaires=[questionnaire_list[2], questionnaire_list[3]])

        atts = []
        atts.append(baker.make(QualityAttribute, assessment_subject=subject1, weight=1))
        atts.append(baker.make(QualityAttribute, assessment_subject=subject1, weight=1))
        atts.append(baker.make(QualityAttribute, assessment_subject=subject1, weight=1))
        atts.append(baker.make(QualityAttribute, assessment_subject=subject2, weight=1))
        atts.append(baker.make(QualityAttribute, assessment_subject=subject2, weight=1))
        atts.append(baker.make(QualityAttribute, assessment_subject=subject2, weight=1))
        atts.append(baker.make(QualityAttribute, assessment_subject=subject2, weight=1))

        question_impacts = []

        maturity_level_0 = baker.make(MaturityLevel, title='Elementary', value=0, assessment_kit=assessment_kit)
        maturity_level_1 = baker.make(MaturityLevel, title='Weak', value=1, assessment_kit=assessment_kit)
        maturity_level_2 = baker.make(MaturityLevel, title='Moderate', value=2, assessment_kit=assessment_kit)
        maturity_level_3 = baker.make(MaturityLevel, title='Good', value=3, assessment_kit=assessment_kit)
        maturity_level_4 = baker.make(MaturityLevel, title='Great', value=4, assessment_kit=assessment_kit)
        maturity_level_5 = baker.make(MaturityLevel, title='Exceptional', value=5, assessment_kit=assessment_kit)
        maturity_level = [maturity_level_0, maturity_level_1, maturity_level_2, maturity_level_3, maturity_level_4,
                          maturity_level_5]

        level_competences = []
        level_competences.append(baker.make(LevelCompetence, maturity_level=maturity_level_0, value=50,
                                            maturity_level_competence=maturity_level_1))
        level_competences.append(baker.make(LevelCompetence, maturity_level=maturity_level_1, value=50,
                                            maturity_level_competence=maturity_level_2))

        # att1
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_1, quality_attribute=atts[0],
                                           question=questions_list[0]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_1, quality_attribute=atts[0],
                                           question=questions_list[1]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_2, quality_attribute=atts[0],
                                           question=questions_list[2]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_2, quality_attribute=atts[0],
                                           question=questions_list[3]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_2, quality_attribute=atts[0],
                                           question=questions_list[4]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_3, quality_attribute=atts[0],
                                           question=questions_list[5]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_3, quality_attribute=atts[0],
                                           question=questions_list[6]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_3, quality_attribute=atts[0],
                                           question=questions_list[7]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_4, quality_attribute=atts[0],
                                           question=questions_list[8]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_4, quality_attribute=atts[0],
                                           question=questions_list[9]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_5, quality_attribute=atts[0],
                                           question=questions_list[10]))
        # 0-10

        # att2
        # 11-21
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_1, quality_attribute=atts[1],
                                           question=questions_list[0]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_1, quality_attribute=atts[1],
                                           question=questions_list[1]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_2, quality_attribute=atts[1],
                                           question=questions_list[2]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_2, quality_attribute=atts[1],
                                           question=questions_list[3]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_3, quality_attribute=atts[1],
                                           question=questions_list[4]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_3, quality_attribute=atts[1],
                                           question=questions_list[5]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_3, quality_attribute=atts[1],
                                           question=questions_list[6]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_4, quality_attribute=atts[1],
                                           question=questions_list[7]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_4, quality_attribute=atts[1],
                                           question=questions_list[8]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_5, quality_attribute=atts[1],
                                           question=questions_list[9]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_5, quality_attribute=atts[1],
                                           question=questions_list[10]))

        # att3
        # 22-32
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_1, quality_attribute=atts[2],
                                           question=questions_list[0]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_2, quality_attribute=atts[2],
                                           question=questions_list[1]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_2, quality_attribute=atts[2],
                                           question=questions_list[2]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_2, quality_attribute=atts[2],
                                           question=questions_list[3]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_2, quality_attribute=atts[2],
                                           question=questions_list[4]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_3, quality_attribute=atts[2],
                                           question=questions_list[5]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_3, quality_attribute=atts[2],
                                           question=questions_list[6]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_3, quality_attribute=atts[2],
                                           question=questions_list[7]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_3, quality_attribute=atts[2],
                                           question=questions_list[8]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_3, quality_attribute=atts[2],
                                           question=questions_list[9]))
        question_impacts.append(baker.make(QuestionImpact, maturity_level=maturity_level_3, quality_attribute=atts[2],
                                           question=questions_list[10]))

        answer_template = []
        answer_template.append(baker.make(AnswerTemplate, caption="test", value=1, index=1, question=questions_list[0]))
        answer_template.append(baker.make(AnswerTemplate, caption="test", value=1, index=1, question=questions_list[1]))

        option_value = []
        option_value.append(
            baker.make(OptionValue, option=answer_template[0], value=0.5, question_impact=question_impacts[0]))
        option_value.append(
            baker.make(OptionValue, option=answer_template[1], value=0.5, question_impact=question_impacts[1]))

        base_info = Dictionary()
        base_info.add("assessment_kit", assessment_kit)
        base_info.add("questionnaires", questionnaire_list)
        base_info.add("question_impacts", question_impacts)
        base_info.add("questions", questions_list)
        base_info.add("subject1", subject1)
        base_info.add("subject2", subject2)
        base_info.add("subject2", subject2)
        base_info.add("attributes", atts)
        base_info.add("answer_template", answer_template)
        base_info.add("maturity_levels", maturity_level)
        base_info.add("option_value", option_value)
        base_info.add("level_competences", level_competences)
        return base_info

    return do_init_data
