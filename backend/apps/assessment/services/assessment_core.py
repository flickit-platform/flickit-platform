import requests
from operator import itemgetter
from rest_framework import status

from account.models import Space
from assessment.serializers.projectserializers import LoadQuestionnairesSerializer
from assessment.serializers.questionvalueserializers import LoadQuestionnaireAnswerSerializer
from assessmentplatform.settings import ASSESSMENT_URL, ASSESSMENT_SERVER_PORT
from baseinfo.models.assessmentkitmodels import AssessmentKit, MaturityLevel
from baseinfo.models.basemodels import Questionnaire, AssessmentSubject, QualityAttribute
from baseinfo.models.questionmodels import Question, AnswerTemplate
from baseinfo.serializers.assessmentkitserializers import LoadAssessmentKitDetailsForReportSerializer


def create_assessment(user, data):
    result = dict()
    if not user.spaces.filter(id=data["space_id"]).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'space_id' does not exist"}
        return result
    if not AssessmentKit.objects.filter(id=data["assessment_kit_id"]).filter(is_active=True).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'assessment_kit_id' does not exist"}
        return result

    body = dict()
    body["spaceId"] = data["space_id"]
    body["title"] = data["title"]
    body["assessmentKitId"] = data["assessment_kit_id"]
    body["colorId"] = data["color_id"]
    response = requests.post(ASSESSMENT_URL + 'assessment-core/api/assessments', json=body)
    result["Success"] = True
    result["body"] = response
    return result


def get_assessment_list(request):
    result = dict()
    params = dict()
    if "space_id" in request.query_params:
        space_id = request.query_params["space_id"]
        params["spaceIds"] = [space_id]
    else:
        space_ids = list(request.user.spaces.values_list("id", flat=True))
        params["spaceIds"] = space_ids

    if not request.user.spaces.filter(id__in=params["spaceIds"]).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'space_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result

    if "size" in request.query_params:
        size = request.query_params["size"]
        params["size"] = size

    if "page" in request.query_params:
        page = request.query_params["page"]
        params["page"] = page

    if "kit_id" in request.query_params:
        kit_id = request.query_params["kit_id"]
        params["kitId"] = kit_id
    response = requests.get(ASSESSMENT_URL + 'assessment-core/api/assessments', params=params)
    if response.status_code == status.HTTP_200_OK:
        data = response.json()
        items = list()
        for item in data["items"]:
            row_data = dict()
            row_data["id"] = item["id"]
            row_data["title"] = item["title"]
            space = Space.objects.get(id=item["spaceId"])
            row_data["space"] = {"id": space.id,
                                 "title": space.title
                                 }
            row_data["last_modification_time"] = item["lastModificationTime"]
            row_data["color"] = item["color"]
            row_data["is_calculate_valid"] = item["isCalculateValid"]
            assessment_kit = AssessmentKit.objects.get(id=item["assessmentKitId"])
            row_data["assessment_kit"] = {"id": assessment_kit.id,
                                          "title": assessment_kit.title,
                                          "maturity_levels_count": assessment_kit.maturity_levels.count()
                                          }
            if item["maturityLevelId"] is not None:
                level = MaturityLevel.objects.get(id=item["maturityLevelId"])
                maturity_levels_id = list(assessment_kit.maturity_levels.values_list("id", flat=True))
                row_data["result_maturity_level"] = {"id": level.id,
                                                     "title": level.title,
                                                     "index": maturity_levels_id.index(item["maturityLevelId"]) + 1,
                                                     "value": level.value
                                                     }
            else:
                row_data["result_maturity_level"] = None

            items.append(row_data)
        data["items"] = items
        result["Success"] = True
        result["body"] = data
        result["status_code"] = status.HTTP_200_OK
        return result
    result["Success"] = False
    result["body"] = response.json()
    result["status_code"] = response.status_code
    return result


def question_answering(assessments_details, serializer_data):
    data = {"assessmentId": assessments_details["assessmentId"],
            "questionnaireId": serializer_data["questionnaire_id"],
            "questionId": serializer_data["question_id"],
            "answerOptionId": serializer_data["answer_option_id"],
            "confidenceLevelId": serializer_data["confidence_level_id"],
            }

    if "is_not_applicable" in serializer_data:
        data["isNotApplicable"] = serializer_data["is_not_applicable"]

    result = dict()
    if not Questionnaire.objects.filter(id=serializer_data["questionnaire_id"]).filter(
            assessment_kit=assessments_details["kitId"]).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'questionnaire_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result

    if not Question.objects.filter(id=serializer_data["question_id"]).filter(
            questionnaire=serializer_data["questionnaire_id"]).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'question_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result

    if serializer_data["answer_option_id"] is not None:
        if not AnswerTemplate.objects.filter(id=serializer_data["answer_option_id"]).filter(
                question=serializer_data["question_id"]).exists():
            result["Success"] = False
            result["body"] = {"code": "NOT_FOUND", "message": "'answer_option_id' does not exist"}
            result["status_code"] = status.HTTP_400_BAD_REQUEST
            return result

    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessments_details["assessmentId"]}/answer-question',
        json=data)
    if response.status_code == status.HTTP_201_CREATED:
        result["Success"] = True
        result["body"] = response.json()
        result["status_code"] = response.status_code
        return result

    result["Success"] = False
    result["body"] = response.json()
    result["status_code"] = response.status_code
    return result


def get_maturity_level_calculate(assessments_details):
    result = dict()
    response = requests.post(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessments_details["assessmentId"]}/calculate')
    if response.status_code == status.HTTP_200_OK:
        data = response.json()
        data["maturity_level"] = data.pop("maturityLevel")
        level = MaturityLevel.objects.get(id=data["maturity_level"]["id"])
        maturity_levels_id = list(level.assessment_kit.maturity_levels.values_list("id", flat=True))
        data["maturity_level"]["title"] = level.title
        data["maturity_level"]["index"] = maturity_levels_id.index(data["maturity_level"]["id"]) + 1
        data["maturity_level"]["value"] = data["maturity_level"].pop("value")
        data["maturity_level"].pop("levelCompetences")
        result["Success"] = True
        result["body"] = data
        result["status_code"] = response.status_code
        return result

    result["Success"] = True
    result["body"] = response.json()
    result["status_code"] = response.status_code
    return result


def get_questionnaire_answer(request, assessments_details, questionnaire_id):
    params = {"questionnaireId": questionnaire_id,
              'page': 0,
              'size': 50,
              }
    result = dict()
    if not Questionnaire.objects.filter(id=questionnaire_id).filter(
            assessment_kit=assessments_details["kitId"]).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'questionnaire_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result
    questionnaire = Questionnaire.objects.get(id=questionnaire_id)
    if "size" in request.query_params:
        size = request.query_params["size"]
        params["size"] = size

    if "page" in request.query_params:
        page = request.query_params["page"]
        params["page"] = page

    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessments_details["assessmentId"]}/answers',
        params=params)

    if response.status_code == status.HTTP_200_OK:
        response_body = response.json()
        questions_id = list()
        for item in response_body["items"]:
            questions_id.append(item["questionId"])
        questions = questionnaire.question_set.order_by("index")
        items = LoadQuestionnaireAnswerSerializer(questions, many=True).data
        for i in range(len(items)):
            if items[i]["id"] in questions_id:
                response_item = list(filter(lambda x: x['questionId'] == items[i]["id"], response_body["items"]))[0]
                items[i]["confidence_level"] = response_item["confidenceLevel"]
                if response_item["answerOptionId"] is not None:
                    answer = \
                        list(filter(lambda x: x['id'] == response_item["answerOptionId"], items[i]["answer_options"]))[
                            0].copy()
                    items[i]["answer"] = answer
                else:
                    items[i]["answer"] = None
                items[i]["is_not_applicable"] = response_item["isNotApplicable"]
            else:
                items[i]["answer"] = None
                items[i]["is_not_applicable"] = False
                items[i]["confidence_level"] = None


        response_body = {"items": items}
        result["Success"] = True
        result["body"] = response_body
        result["status_code"] = response.status_code
        return result

    result["Success"] = False
    result["body"] = response.json()
    result["status_code"] = response.status_code
    return result


def get_questionnaires_in_assessment(assessments_details):
    questionnaire_query = Questionnaire.objects.filter(assessment_kit=assessments_details["kitId"])
    questionnaire_data = LoadQuestionnairesSerializer(questionnaire_query, many=True).data

    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessments_details["assessmentId"]}/questionnaires/progress', )
    response_body = response.json()
    answer_dict = dict()
    for item in response_body["items"]:
        answer_dict[item['id']] = item['answersCount']

    for i in range(len(questionnaire_data)):
        if questionnaire_data[i]["id"] in answer_dict:
            questionnaire_data[i]["answers_count"] = answer_dict[questionnaire_data[i]["id"]]
            questionnaire_data[i]["progress"] = int(
                questionnaire_data[i]["answers_count"] / questionnaire_data[i]["questions_count"] * 100)


        else:
            questionnaire_data[i]["answers_count"] = 0
            questionnaire_data[i]["progress"] = 0
    result = dict()
    result["Success"] = True
    result["body"] = {"items": questionnaire_data}
    result["status_code"] = status.HTTP_200_OK
    return result


def get_assessment_progress(assessments_details):
    result = dict()
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessments_details["assessmentId"]}/progress', )
    response_body = response.json()
    if response.status_code == status.HTTP_200_OK:
        question_count = Question.objects.filter(questionnaire__assessment_kit=assessments_details["kitId"]).count()
        response_body["question_count"] = question_count
        response_body["answers_count"] = response_body.pop("allAnswersCount")
        result["Success"] = True
        result["body"] = response_body
        result["status_code"] = response.status_code
        return result

    result["Success"] = False
    result["body"] = response_body
    result["status_code"] = response.status_code
    return result


def get_subject_report(assessments_details, subject_id):
    result = dict()

    if not AssessmentSubject.objects.filter(id=subject_id).filter(
            assessment_kit=assessments_details["kitId"]).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'subject_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result

    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessments_details["assessmentId"]}/report/subjects/{subject_id}', )
    response_body = response.json()

    if response.status_code == status.HTTP_200_OK:
        subject_dict = dict()
        attribute_list = list()
        levels = MaturityLevel.objects.filter(assessment_kit=assessments_details["kitId"]).values('id', 'title', 'value')
        subject = AssessmentSubject.objects.get(id=response_body["subject"]["id"])
        subject_dict["id"] = subject.id
        subject_dict["title"] = subject.title
        maturity_level = MaturityLevel.objects.get(id=response_body["subject"]["maturityLevelId"])
        maturity_levels_id = list(maturity_level.assessment_kit.maturity_levels.values_list("id", flat=True))
        maturity_levels_count = len(maturity_levels_id)
        subject_dict["maturity_level"] = {
            "id": maturity_level.id,
            "title": maturity_level.title,
            "value": maturity_level.value,
            "index": maturity_levels_id.index(maturity_level.id) + 1,
            "maturity_levels_count": maturity_levels_count

        }
        subject_dict["confidence_value"] = response_body["subject"]["confidenceValue"]
        subject_dict["is_calculate_valid"] = response_body["subject"]["isCalculateValid"]
        subject_dict["is_confidence_valid"] = response_body["subject"]["isConfidenceValid"]
        for item in response_body["attributes"]:
            attributes_dict = dict()
            attribute = QualityAttribute.objects.get(id=item["id"])
            attributes_dict["id"] = attribute.id
            attributes_dict["title"] = attribute.title
            attributes_dict["index"] = attribute.index
            attributes_dict["description"] = attribute.description
            maturity_level = MaturityLevel.objects.get(id=item["maturityLevelId"])
            attributes_dict["maturity_level"] = {
                "id": maturity_level.id,
                "title": maturity_level.title,
                "value": maturity_level.value,
                "index": maturity_levels_id.index(maturity_level.id) + 1,
            }

            maturity_scores = list()
            for i in range(len(levels)):
                levels[i]["index"] = maturity_levels_id.index(levels[i]["id"]) + 1
                maturity_scores.append({"maturity_level": levels[i], "score": item["maturityScores"][i]["score"]})
            attributes_dict["maturity_scores"] = maturity_scores
            attributes_dict["confidence_value"] = item["confidenceValue"]
            attribute_list.append(attributes_dict)
        attribute_list = sorted(attribute_list, key=itemgetter('index'))

        attribute_top_weaknesses_id = list()
        for item in response_body["topWeaknesses"]:
            attribute_top_weaknesses_id.append(item["id"])
        attributes_top_weaknesses = QualityAttribute.objects.filter(id__in=attribute_top_weaknesses_id).values("id",
                                                                                                               "title")

        attribute_top_strengths_id = list()
        for item in response_body["topStrengths"]:
            attribute_top_strengths_id.append(item["id"])
        attributes_top_strengths = QualityAttribute.objects.filter(id__in=attribute_top_strengths_id).values("id",
                                                                                                             "title")

        result["Success"] = True
        result["body"] = {"subject": subject_dict,
                          "attributes": attribute_list,
                          "top_strengths": attributes_top_strengths,
                          "top_weaknesses": attributes_top_weaknesses,
                          }
        result["status_code"] = status.HTTP_200_OK
        return result

    result["Success"] = False
    result["body"] = response_body
    result["status_code"] = response.status_code
    return result


def get_subject_progress(assessments_details, subject_id):
    result = dict()
    if not AssessmentSubject.objects.filter(id=subject_id).filter(
            assessment_kit=assessments_details["kitId"]).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'subject_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessments_details["assessmentId"]}/subjects/{subject_id}/progress')
    response_body = response.json()
    if response.status_code == status.HTTP_200_OK:
        subject = AssessmentSubject.objects.get(id=subject_id)
        question_count = Question.objects.filter(quality_attributes__assessment_subject=subject_id).distinct().count()
        response_body["title"] = subject.title
        response_body["question_count"] = question_count
        response_body["answers_count"] = response_body.pop("answerCount")
        result["Success"] = True
        result["body"] = response_body
        result["status_code"] = status.HTTP_200_OK
        return result

    result["Success"] = False
    result["body"] = response_body
    result["status_code"] = response.status_code
    return result


def get_assessment_report(assessments_details):
    result = dict()
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessments_details["assessmentId"]}/report')
    response_body = response.json()
    if response.status_code == status.HTTP_200_OK:
        assessment_dict = dict()
        assessment_dict["id"] = response_body["assessment"]["id"]
        assessment_dict["title"] = response_body["assessment"]["title"]
        assessment_kit_details = LoadAssessmentKitDetailsForReportSerializer(
            AssessmentKit.objects.get(id=assessments_details["kitId"])).data
        assessment_dict["assessment_kit"] = assessment_kit_details
        assessment_dict["last_modification_time"] = response_body["assessment"]["lastModificationTime"]
        assessment_dict["is_calculate_valid"] = response_body["assessment"]["isCalculateValid"]
        maturity_level = MaturityLevel.objects.get(id=response_body["assessment"]["maturityLevelId"])
        maturity_levels_id = list(maturity_level.assessment_kit.maturity_levels.values_list("id", flat=True))
        assessment_dict["assessment_kit"]["maturity_level"] = {"id": maturity_level.id,
                                                               "title": maturity_level.title,
                                                               "value": maturity_level.value,
                                                               "index": maturity_levels_id.index(maturity_level.id) + 1
                                                               }
        assessment_dict["confidence_value"] = response_body["assessment"]["confidenceValue"]
        assessment_dict["color"] = response_body["assessment"]["color"]

        subject_list = list()
        for item in response_body["subjects"]:
            subject = AssessmentSubject.objects.get(id=item['id'])
            level = MaturityLevel.objects.get(id=item['maturityLevelId'])
            subject_list.append({"id": subject.id,
                                 "title": subject.title,
                                 "index": subject.index,
                                 "description": subject.description,
                                 "maturity_level": {
                                     "id": level.id,
                                     "title": level.title,
                                 }
                                 })
        subject_list = sorted(subject_list, key=itemgetter('index'))


        attribute_top_weaknesses_id = list()
        for item in response_body["topWeaknesses"]:
            attribute_top_weaknesses_id.append(item["id"])
        attributes_top_weaknesses = QualityAttribute.objects.filter(id__in=attribute_top_weaknesses_id).values("id",
                                                                                                               "title")

        attribute_top_strengths_id = list()
        for item in response_body["topStrengths"]:
            attribute_top_strengths_id.append(item["id"])
        attributes_top_strengths = QualityAttribute.objects.filter(id__in=attribute_top_strengths_id).values("id",
                                                                                                             "title")

        result["Success"] = True
        result["body"] = {"assessment": assessment_dict,
                          "subjects": subject_list,
                          "top_strengths": attributes_top_strengths,
                          "top_weaknesses": attributes_top_weaknesses,
                          }
        result["status_code"] = response.status_code
        return result

    result["Success"] = False
    result["body"] = response_body
    result["status_code"] = response.status_code
    return result


def get_path_info_with_assessment_id(assessments_details):
    result = dict()
    assessment = {"id": assessments_details["assessmentId"],
                  "title": assessments_details["assessmentTitle"]
                  }
    space_object = Space.objects.get(id=assessments_details["spaceId"])
    space = {"id": assessments_details["spaceId"],
             "title": space_object.title
             }
    result["body"] = {"assessment": assessment,
                      "space": space
                      }
    result["status_code"] = status.HTTP_200_OK
    return result


def edit_assessment(assessments_details, request_body):
    result = dict()
    data_json = {"title": request_body["title"],
                 "colorId": request_body["color_id"]
                 }
    response = requests.put(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessments_details["assessmentId"]}', json=data_json)
    response_body = response.json()
    result["Success"] = True
    result["body"] = response_body
    result["status_code"] = response.status_code
    return result


def delete_assessment(assessments_details):
    result = dict()
    response = requests.delete(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessments_details["assessmentId"]}')
    result["Success"] = True
    result["body"] = None
    result["status_code"] = response.status_code
    return result


def get_path_info_with_space_id(space_id):
    result = dict()
    if not Space.objects.filter(id=space_id).exists():
        result["Success"] = False
        result["body"] = {"code": "NOT_FOUND", "message": "'space_id' does not exist"}
        result["status_code"] = status.HTTP_400_BAD_REQUEST
        return result
    space_object = Space.objects.get(id=space_id)
    space = {"id": space_object.id,
             "title": space_object.title
             }
    result["body"] = {
        "space": space
    }
    result["status_code"] = status.HTTP_200_OK
    return result
