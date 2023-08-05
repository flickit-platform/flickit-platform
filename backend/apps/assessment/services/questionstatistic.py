from baseinfo.models.basemodels import Questionnaire, AssessmentSubject

from assessment.fixture.dictionary import Dictionary
from assessment.models import AssessmentResult


def extract_total_answered_question_number(result: AssessmentResult, questionnaire: Questionnaire):
    questions = questionnaire.question_set.all()
    answered_question = 0
    total_answered_question_number = 0
    for question in questions:
        question_values = question.question_values
        for value in question_values.filter(assessment_result_id=result.id):
            if value.question_id == question.id:
                if value.answer is not None:
                    answered_question += 1
    total_answered_question_number += answered_question
    return total_answered_question_number

def calculate_answered_question_by_subject(result: AssessmentResult, subject: AssessmentSubject):
    total_answered_question_number = 0
    for questionnaire in subject.questionnaires.all():
        total_answered_question_number += extract_total_answered_question_number(result, questionnaire) 
    return total_answered_question_number

def calculate_total_question_number_by_subject(subject: AssessmentSubject):
    total_question_number = 0
    for questionnaire in subject.questionnaires.all():
        questions = questionnaire.question_set.all()
        total_question_number += len(questions)
    return total_question_number

def calculate_answered_question_by_result(result:AssessmentResult):
    total_answered_question_number = 0
    for questionnaire in Questionnaire.objects.filter(assessment_kit_id = result.assessment_project.assessment_kit_id):
        total_answered_question_number += extract_total_answered_question_number(result, questionnaire) 
    return total_answered_question_number

def calculate_total_question_number_by_result(result:AssessmentResult):
    total_question_number = 0
    for questionnaire in Questionnaire.objects.filter(assessment_kit_id = result.assessment_project.assessment_kit_id):
        questions = questionnaire.question_set.all()
        total_question_number += len(questions)
    return total_question_number

def extract_total_progress(result):
    total_progress = Dictionary()
    total_answered_question_number = calculate_answered_question_by_result(result)
    total_question_number = calculate_total_question_number_by_result(result)

    total_progress.add("total_answered_question_number", total_answered_question_number)
    total_progress.add("total_question_number", total_question_number)
    if total_question_number == 0:
        total_progress.add("progress", 0)
    else:
        total_progress.add("progress", (total_answered_question_number/total_question_number) * 100)
    return total_progress

def extract_subject_total_progress(result: AssessmentResult, subject: AssessmentSubject):
    total_progress = Dictionary()
    total_answered_question_number = calculate_answered_question_by_subject(result, subject)
    total_question_number = calculate_total_question_number_by_subject(subject)

    total_progress.add("total_answered_question_number", total_answered_question_number)
    total_progress.add("total_question_number", total_question_number)
    total_progress.add("progress", (total_answered_question_number/total_question_number) * 100)
    return total_progress