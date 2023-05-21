import more_itertools

from assessment.models import AssessmentResult


def extract_most_significant_strength_atts(result: AssessmentResult):
        quality_attributes = []
        if result.assessment_project.maturity_level is not None:
            for att_value in result.quality_attribute_values.order_by('-maturity_level__value').all():
                if att_value.maturity_level.value > 2:
                    quality_attributes.append(att_value.quality_attribute.title)
            return more_itertools.take(3, quality_attributes)
        else:
            return []
        
def extract_most_significant_weaknessness_atts(result: AssessmentResult):
    quality_attributes = []
    if result.assessment_project.maturity_level is not None and result.assessment_project.maturity_level:
        for att_value in result.quality_attribute_values.order_by('-maturity_level__value').all():
            if att_value.maturity_level.value < 3:
                quality_attributes.append(att_value.quality_attribute.title)
        return more_itertools.take(3, reversed(quality_attributes))
    else:
        return []