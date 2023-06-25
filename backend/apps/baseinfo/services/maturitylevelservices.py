from baseinfo.models.assessmentkitmodels import MaturityLevel

def extract_maturity_level_by_value(assessment_kit, value):
    return MaturityLevel.objects.get(assessment_kit = assessment_kit, value = value)