from assessment.services.questionnairereport import QuestionnaireReportInfo


def calculate_total_progress(questionnaire_report_info, content):
    total_answered_question_number = 0
    total_question_number = 0
    for questionnaire_info in questionnaire_report_info.questionnaires_info:
        total_answered_question_number += questionnaire_info['answered_question']
        total_question_number += questionnaire_info['question_number']

    content['total_answered_question_number'] = total_answered_question_number
    content['total_question_number'] = total_question_number
    content['progress'] =  (total_answered_question_number/total_question_number) * 100

def extract_questionnaire_report_info(subject_id, assessment_project, result_id):
    if subject_id:
        questionnaires = assessment_project.assessment_kit.questionnaires.filter(assessment_subjects__id=subject_id)
    else:
        questionnaires = assessment_project.assessment_kit.questionnaires.all()
    questionnaire_report_info = __extract_questionnaire_info(result_id, questionnaires)
    return questionnaire_report_info

def __extract_questionnaire_info(result_id, questionnaires):
    questionnaire_report_info = QuestionnaireReportInfo(questionnaires)
    questionnaire_report_info.calculate_questionnaire_info(result_id)
    return questionnaire_report_info
