from baseinfo.models.assessmentkitmodels import AssessmentKit


def load_assessment_kit(assessment_kit_id) -> AssessmentKit:
    try:
        return AssessmentKit.objects.get(id=assessment_kit_id)
    except AssessmentKit.DoesNotExist as e:
        raise AssessmentKit.DoesNotExist

