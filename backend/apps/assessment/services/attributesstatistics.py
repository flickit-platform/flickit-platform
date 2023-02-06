import more_itertools
from ..models import AssessmentResult


def extract_most_significant_strength_atts(result: AssessmentResult):
        quality_attributes = []
        if result.assessment_project.status is not None:
            for att_value in result.quality_attribute_values.order_by('-maturity_level_value').all():
                if att_value.maturity_level_value > 2:
                    quality_attributes.append(att_value.quality_attribute.title)
            return more_itertools.take(3, quality_attributes)
        else:
            return []
        
def extract_most_significant_weaknessness_atts(result: AssessmentResult):
    quality_attributes = []
    if result.assessment_project.status is not None and result.assessment_project.status:
        for att_value in result.quality_attribute_values.order_by('-maturity_level_value').all():
            if att_value.maturity_level_value < 3:
                quality_attributes.append(att_value.quality_attribute.title)
        return more_itertools.take(3, reversed(quality_attributes))
    else:
        return []