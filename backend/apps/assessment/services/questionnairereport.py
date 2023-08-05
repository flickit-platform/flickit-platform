class QuestionnaireReportInfo():
    def __init__(self, questionnaires):
        self.questionnaires_info = []
        self.questionnaires = questionnaires
        self.total_question_number = 0
        self.total_answered_question = 0

    def calculate_questionnaire_info(self, assessment_result_pk):
        for questionnaire in self.questionnaires:
            questions = questionnaire.question_set.all()
            questions_number = len(questions)
            self.total_question_number += questions_number
            answered_question = self.__calculate_question_number(assessment_result_pk, questions)
            questionnaire_info = self.__set_base_questionnaire_info(questionnaire, answered_question)
            questionnaire_info['current_question_index'] = self.find_current_question_index(assessment_result_pk, questions)
            questionnaire_info['progress'] = self.__calculate_progress(questions_number, answered_question)
            self.questionnaires_info.append(questionnaire_info)

    def find_current_question_index(self, assessment_result_pk, questions):
        no_answered_question_index_list = []
        for question in questions:
            question_value = question.question_values.filter(assessment_result_id=assessment_result_pk, question_id = question.id).first()
            if question_value is None or question_value.answer is None:
                no_answered_question_index_list.append(question.index)
        if no_answered_question_index_list:
            current_index = min(no_answered_question_index_list)
        else:
            current_index = -1
        return current_index

    def __calculate_progress(self, questions_number, answered_question):
        if questions_number != 0:
            return ((answered_question / questions_number) * 100)
        else:
            return 0

    def __set_base_questionnaire_info(self, questionnaire, answered_question):
        questionnaire_info = {}
        questionnaire_info['question_number'] = len(questionnaire.question_set.all())
        questionnaire_info['title'] = questionnaire.title
        questionnaire_info['id'] = questionnaire.id
        questionnaire_info['answered_question'] = answered_question
        questionnaire_info['subject'] = questionnaire.assessment_subjects.values('id', 'title')
        return questionnaire_info

    def __calculate_question_number(self, assessment_result_pk, questions):
        answered_question = 0
        for question in questions:
            question_values = question.question_values
            for value in question_values.filter(assessment_result_id=assessment_result_pk):
                if value.question_id == question.id:
                    if value.answer is not None:
                        answered_question += 1
                        self.total_answered_question +=1
        return answered_question