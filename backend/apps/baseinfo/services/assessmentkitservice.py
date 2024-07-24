from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from common.restutil import ActionResult
from baseinfo.models.assessmentkitmodels import AssessmentKitLike
from baseinfo.serializers import assessmentkitserializers
from baseinfo.models.assessmentkitmodels import AssessmentKit, AssessmentKitTag, MaturityLevel


def load_assessment_kit(assessment_kit_id) -> AssessmentKit:
    try:
        return AssessmentKit.objects.get(id=assessment_kit_id)
    except AssessmentKit.DoesNotExist as e:
        raise AssessmentKit.DoesNotExist


def load_assessment_kit_tag(tag_id) -> AssessmentKitTag:
    try:
        return AssessmentKitTag.objects.get(id=tag_id)
    except AssessmentKitTag.DoesNotExist:
        raise ObjectDoesNotExist


def load_maturity_level(maturity_level_id) -> MaturityLevel:
    try:
        return MaturityLevel.objects.get(id=maturity_level_id)
    except MaturityLevel.DoesNotExist as e:
        raise MaturityLevel.DoesNotExist


def get_current_user_is_coordinator(assessment_kit: AssessmentKit, current_user_id):
    if assessment_kit.expert_group is not None:
        if assessment_kit.expert_group.owner is not None:
            if assessment_kit.expert_group.owner.id == current_user_id:
                return True
    return False


def get_maturity_level_with_assessment_kit(assessment_kit_id):
    try:
        kit = AssessmentKit.objects.get(id=assessment_kit_id)
    except AssessmentKit.DoesNotExist as e:
        return False
    result = MaturityLevel.objects.filter(kit_version=kit.kit_version_id)
    return result


def get_assessment_kit(assessment_kit_id):
    result = AssessmentKit.objects.filter(id=assessment_kit_id)
    return result


@transaction.atomic
def update_assessment_kit_info(assessment_kit_id, **kwargs):
    assessment_kit = AssessmentKit.objects.get(id=assessment_kit_id)
    if len(kwargs) == 0:
        return ActionResult(success=True)

    if "tags" in kwargs:
        if len(kwargs["tags"]) == AssessmentKitTag.objects.filter(id__in=kwargs["tags"]).count():
            assessment_kit.tags.clear()
            for tag in kwargs["tags"]:
                assessment_kit.tags.add(AssessmentKitTag.objects.get(id=tag))
                assessment_kit.save()
            kwargs.pop("tags")
        else:
            return ActionResult(success=False, message="'tag_id' does not exists.")
    if "price" in kwargs:
        kwargs.pop("price")
    assessment_kit = AssessmentKit.objects.filter(id=assessment_kit_id).update(**kwargs)
    return ActionResult(success=True)


def get_maturity_level_for_internal(maturity_levels):
    level_ids = list(maturity_levels.values_list("id", flat=True))
    levels_list = list()
    for level in maturity_levels:
        level_competences = assessmentkitserializers.SimpleLevelCompetenceSerilizer(level.level_competences,
                                                                                    many=True).data
        levels_list.append({"id": level.id,
                            "value": level.value,
                            "index": level_ids.index(level.id) + 1,
                            "level_competences": level_competences,
                            })
    return levels_list
