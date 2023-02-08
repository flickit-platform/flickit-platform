class QuestionnaireReportInfo():
    def __init__(self, questionnaires):
        self.questionnaires_info = []
        self.questionnaires = questionnaires
        self.total_metric_number = 0
        self.total_answered_metric = 0

    def calculate_questionnaire_info(self, assessment_result_pk):
        for questionnaire in self.questionnaires:
            metrics = questionnaire.metric_set.all()
            metrics_number = len(metrics)
            self.total_metric_number += metrics_number
            answered_metric = self.__calculate_metric_number(assessment_result_pk, metrics)
            questionnaire_info = self.__set_base_questionnaire_info(questionnaire, answered_metric)
            questionnaire_info['current_metric_index'] = self.find_current_metric_index(assessment_result_pk, metrics)
            questionnaire_info['progress'] = self.__calculate_progress(metrics_number, answered_metric)
            self.questionnaires_info.append(questionnaire_info)

    def find_current_metric_index(self, assessment_result_pk, metrics):
        no_answered_metric_index_list = []
        for metric in metrics:
            metric_value = metric.metric_values.filter(assessment_result_id=assessment_result_pk, metric_id = metric.id).first()
            if metric_value is None or metric_value.answer is None:
                no_answered_metric_index_list.append(metric.index)
        if no_answered_metric_index_list:
            current_index = min(no_answered_metric_index_list)
        else:
            current_index = -1
        return current_index

    def __calculate_progress(self, metrics_number, answered_metric):
        if metrics_number != 0:
            return ((answered_metric / metrics_number) * 100)
        else:
            return 0

    def __set_base_questionnaire_info(self, questionnaire, answered_metric):
        questionnaire_info = {}
        questionnaire_info['metric_number'] = len(questionnaire.metric_set.all())
        questionnaire_info['title'] = questionnaire.title
        questionnaire_info['id'] = questionnaire.id
        questionnaire_info['answered_metric'] = answered_metric
        questionnaire_info['subject'] = questionnaire.assessment_subjects.values('id', 'title')
        return questionnaire_info

    def __calculate_metric_number(self, assessment_result_pk, metrics):
        answered_metric = 0
        for metric in metrics:
            metric_values = metric.metric_values
            for value in metric_values.filter(assessment_result_id=assessment_result_pk):
                if value.metric_id == metric.id:
                    if value.answer is not None:
                        answered_metric += 1
                        self.total_answered_metric +=1
        return answered_metric