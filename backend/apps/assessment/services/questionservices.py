from assessment.fixture.dictionary import Dictionary

# TODO: Handle with a better way for serilizing -> pickle or serilizer.data QuestionSerilizer
def extract_questions(questionnaire, question_values):
    questions = []
    question_query_set = questionnaire.question_set.all().order_by('index')
    for item in question_query_set:
        question = Dictionary()
        question.add('id', item.id)
        question.add('title', item.title)
        question.add('description', item.description)
        question.add('index', item.index)
        question.add('may_not_be_applicable', item.may_not_be_applicable)
        answer_templates = []
        for answer in item.answer_templates.all():
            answer_template = Dictionary()
            answer_template.add('id', answer.id)
            answer_template.add('caption', answer.caption)
            answer_template.add('value', answer.value)
            answer_templates.append(answer_template)
            question.add('answer_templates', answer_templates)
        for value in question_values:
            if value.answer is not None and value.question.id == item.id:
                answer = Dictionary()
                answer.add('id', value.answer.id)
                answer.add('caption', value.answer.caption)
                answer.add('value', value.answer.value)
                question.add('answer', answer)
                break
        questions.append(question)
    return questions
