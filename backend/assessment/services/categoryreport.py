class CategoryReportInfo():
    def __init__(self, metric_categories):
        self.metric_categories_info = []
        self.metric_categories = metric_categories
        self.total_metric_number = 0
        self.total_answered_metric = 0

    def calculate_category_info(self, assessment_result_pk):
        for category in self.metric_categories:
            metrics = category.metric_set.all()
            metrics_number = len(metrics)
            self.total_metric_number += metrics_number
            answered_metric = self.__calculate_metric_number(assessment_result_pk, metrics)
            category_info = self.__set_base_category_info(category, answered_metric)
            category_info['current_metric_index'] = self.find_current_metric_index(assessment_result_pk, metrics)
            category_info['progress'] = self.__calculate_progress(metrics_number, answered_metric)
            self.metric_categories_info.append(category_info)

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

    def __set_base_category_info(self, category, answered_metric):
        category_info = {}
        category_info['metric_number'] = len(category.metric_set.all())
        category_info['title'] = category.title
        category_info['id'] = category.id
        category_info['answered_metric'] = answered_metric
        category_info['subject'] = category.assessment_subjects.values('id', 'title')
        return category_info

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