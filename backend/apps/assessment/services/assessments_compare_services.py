import requests, types

from assessment.services.assessment_report_services import get_assessment_subject_report
from assessmentplatform.settings import ASSESSMENT_URL

from assessment.services import maturity_level_services
from assessment.services import assessment_report_services, confidence_levels_services


class DictObject:
    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            if isinstance(value, dict):
                setattr(self, key, DictObject(**value))
            else:
                setattr(self, key, value)


def get_assessment_progres(request, assessment_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/progress',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def get_subject_progres(request, assessment_id, subject_id):
    response = requests.get(
        ASSESSMENT_URL + f'assessment-core/api/assessments/{assessment_id}/subjects/{subject_id}/progress',
        headers={'Authorization': request.headers['Authorization']})
    return {"Success": True, "body": response.json(), "status_code": response.status_code}


def __get_maturity_level_details_for_assessment(maturity_level, maturity_level_count):
    maturity_level_details = dict()
    maturity_level_details['id'] = maturity_level.id
    maturity_level_details['title'] = maturity_level.title
    maturity_level_details['value'] = maturity_level.value
    maturity_level_details['index'] = maturity_level.index
    maturity_level_details['maturityLevelCount'] = maturity_level_count
    return maturity_level_details


def __get_maturity_level_details_for_subject(maturity_level):
    maturity_level_details = dict()
    maturity_level_details['title'] = maturity_level.title
    maturity_level_details['value'] = maturity_level.value
    maturity_level_details['index'] = maturity_level.index
    return maturity_level_details


def __get_top_weaknesses_for_assessment(top_weaknesses: list):
    top_weaknesses_details = list()
    for top_weakness in top_weaknesses:
        top_weaknesses_details.append(top_weakness["title"])
    return top_weaknesses_details


def __get_top_strengths_for_assessment(top_strengths: list):
    top_strengths_details = list()
    for top_strength in top_strengths:
        top_strengths_details.append(top_strength["title"])
    return top_strengths_details


def __get_subject_progres(subject_progres: DictObject):
    subject_progres_details = dict()
    subject_progres_details['answersCount'] = subject_progres.answerCount
    subject_progres_details['questionsCount'] = subject_progres.questionCount
    subject_progres_details['progress'] = int((subject_progres.answerCount / subject_progres.questionCount) * 100)
    return subject_progres_details


def __get_assessment_progres(assessment_progres: DictObject):
    assessment_progres_details = dict()
    assessment_progres_details['answersCount'] = assessment_progres.answersCount
    assessment_progres_details['questionsCount'] = assessment_progres.questionsCount
    assessment_progres_details['progress'] = int(
        (assessment_progres.answersCount / assessment_progres.questionsCount) * 100)
    return assessment_progres_details


def __get_assessment_details(assessment: DictObject, assessment_progres: DictObject):
    assessment_data = dict()
    assessment_data["id"] = assessment.id
    assessment_data["confidenceValue"] = assessment.confidenceValue
    assessment_data["title"] = assessment.title
    assessment_data["maturityLevel"] = __get_maturity_level_details_for_assessment(assessment.maturityLevel,
                                                                                   assessment.assessmentKit.maturityLevelCount)
    assessment_data["assessmentKit"] = {"id": assessment.assessmentKit.id, "title": assessment.assessmentKit.title}
    assessment_data["progress"] = __get_assessment_progres(assessment_progres)
    return assessment_data


def __get_assessment_details_for_subject(request, assessment, subject_report):
    assessments_data = dict()
    subject = subject_report.subject
    assessments_data["assessmentId"] = assessment.id
    assessments_data["maturityLevel"] = __get_maturity_level_details_for_subject(subject.maturityLevel)
    assessments_data["confidenceValue"] = subject.confidenceValue
    assessments_data["progress"] = __get_subject_progres(
        DictObject(**get_subject_progres(request, assessment.id, subject.id)["body"]))
    assessments_data["topStrengths"] = __get_top_strengths_for_assessment(subject_report.topStrengths)
    assessments_data["topWeaknesses"] = __get_top_weaknesses_for_assessment(subject_report.topWeaknesses)
    return assessments_data


def __get_attributes_details_for_subject(subject_response, assessment, attributes_list):
    attributes = subject_response.attributes
    if len(attributes_list) == 0:
        for attribute in attributes:
            attributes_details = dict()
            attributes_details["id"] = attribute["id"]
            attributes_details["index"] = attribute["index"]
            attributes_details["title"] = attribute["title"]
            attributes_details["assessment"] = list()
            attributes_details["assessment"].append(
                {"assessmentId": assessment.id,
                 "maturityLevel": {
                     "id": attribute["maturityLevel"]["id"],
                     "title": attribute["maturityLevel"]["title"],
                     "value": attribute["maturityLevel"]["value"],
                     "index": attribute["maturityLevel"]["index"],
                 }
                 }
            )
            attributes_list.append(attributes_details)
    else:
        for i in range(len(attributes_list)):
            attributes_list[i]["assessment"].append(
                {
                    "assessmentId": assessment.id,
                    "maturityLevel": {
                        "id": attributes[i]["maturityLevel"]["id"],
                        "title": attributes[i]["maturityLevel"]["title"],
                        "value": attributes[i]["maturityLevel"]["value"],
                        "index": attributes[i]["maturityLevel"]["index"],
                    }
                })

    return attributes_list


def __get_subject_ids(subjects):
    subject_ids = list()
    for subject in subjects:
        subject_ids.append(subject["id"])
    return subject_ids


def get_subject_details(request, assessment, subjects, subjects_list):
    subject_ids = __get_subject_ids(subjects)
    if len(subjects_list) == 0:
        for subject_id in subject_ids:
            subject_details = dict()
            subject_response = DictObject(
                **get_assessment_subject_report(request, assessment.id, subject_id)["body"])
            if subject_id in subject_details:
                result_assessment_details = __get_assessment_details_for_subject(request, assessment, subject_response)
                subject_details["assessments"].append(
                )
                subject_details["attributes"] = __get_attributes_details_for_subject(subject_response, assessment,
                                                                                     subject_details["attributes"])

            else:
                subject_details["id"] = subject_response.subject.id
                subject_details["title"] = subject_response.subject.title
                subject_details["assessments"] = list()
                subject_details["attributes"] = list()
                subject_details["assessments"].append(__get_assessment_details_for_subject(request, assessment,
                                                                                           subject_response))
                subject_details["attributes"] = __get_attributes_details_for_subject(subject_response, assessment,
                                                                                     subject_details["attributes"])
            subjects_list.append(subject_details)
    else:
        for i in range(len(subjects_list)):
            subject_response = DictObject(
                **get_assessment_subject_report(request, assessment.id, subjects_list[i]["id"])["body"])
            subjects_list[i]["assessments"].append(
                __get_assessment_details_for_subject(request, assessment, subject_response))

            subjects_list[i]["attributes"] = __get_attributes_details_for_subject(subject_response, assessment,
                                                                                  subjects_list[i]["attributes"])

    return subjects_list


def get_assessment_details(request, assessment_id):
    result = assessment_report_services.get_assessment_report(request=request, assessment_id=assessment_id)
    assessment_report = DictObject(**result["body"])
    if result["status_code"] == 400:
        if assessment_report.code == "NOT_FOUND":
            return {"status": False}
        if assessment_report.code == "CONFIDENCE_CALCULATION_NOT_VALID":
            confidence_levels_services.get_confidence_levels_calculate_in_assessment_core(request, assessment_id)
            return get_assessment_details(request, assessment_id)
        elif assessment_report.code == "CALCULATE_NOT_VALID":
            maturity_level_services.calculate_maturity_level(request, assessment_id)
            return get_assessment_details(request, assessment_id)
    elif result["status_code"] == 200:
        if not assessment_report.assessment.isCalculateValid:
            confidence_levels_services.get_confidence_levels_calculate_in_assessment_core(request, assessment_id)
            return get_assessment_details(request, assessment_id)
        elif not assessment_report.assessment.isConfidenceValid:
            maturity_level_services.calculate_maturity_level(request, assessment_id)
            return get_assessment_details(request, assessment_id)
    result = get_assessment_progres(request, assessment_id)
    assessment_progres = DictObject(**result["body"])
    subjects = assessment_report.subjects

    assessment_details = __get_assessment_details(assessment=assessment_report.assessment,
                                                  assessment_progres=assessment_progres,
                                                  )
    return {"status": True, "assessment_details": assessment_details, "subjects": subjects,
            "assessment": assessment_report.assessment,
            "assessment_kit_id": assessment_report.assessment.assessmentKit.id}


def get_assessments_compare_service(request):
    assessment_ids = request.query_params.getlist("assessment_id")
    if len(assessment_ids) == 0:
        return {"Success": False, "body": {"code": "INVALID_INPUT", "message": "\'assessmentIds\' may not be empty"},
                "status_code": 400}
    elif len(assessment_ids) == 1:
        return {"Success": False,
                "body": {"code": "INVALID_INPUT",
                         "message": "\'assessmentIds\' size must be greater than or equal to 2"},
                "status_code": 400}

    elif len(assessment_ids) > 4:
        return {"Success": False,
                "body": {"code": "INVALID_INPUT", "message": "\'assessmentIds\' size must be less than or equal to 4"},
                "status_code": 400}

    assessments_list = list()
    subjects_list = list()
    assessment_kit_ids = list()
    for assessment_id in assessment_ids:
        result = get_assessment_details(request, assessment_id)
        if not result["status"]:
            return {"Success": False, "body": {"code": "NOT_FOUND",
                                               "message": "no assessmentResult found by this 'assessmentId'"},
                    "status_code": 400}
        assessment_kit_ids.append(result["assessment_kit_id"])
        if len(set(assessment_kit_ids)) > 1:
            return {"Success": False, "body": {"code": "ASSESSMENTS_NOT_COMPARABLE",
                                               "message": "assessments are not comparable"}, "status_code": 400}

        assessments_list.append(result["assessment_details"])

        subjects_list = get_subject_details(request, result["assessment"], result["subjects"], subjects_list)
    result = {"assessments": assessments_list,
              "subjects": subjects_list}
    return {"Success": True, "body": result, "status_code": 200}
