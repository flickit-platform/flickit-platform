from baseinfo.models.profilemodels import MaturityLevel

def extract_maturity_level_by_value(profile, value):
    return MaturityLevel.objects.get(profile = profile, value = value)