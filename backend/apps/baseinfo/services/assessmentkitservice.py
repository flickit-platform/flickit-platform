from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from common.restutil import ActionResult
from baseinfo.services import expertgroupservice
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


@transaction.atomic
def like_assessment_kit(user, assessment_kit_id):
    assessment_kit = load_assessment_kit(assessment_kit_id)
    deleted_rows_number = AssessmentKitLike.objects.filter(user=user.id, assessment_kit_id=assessment_kit.id).delete()[
        0]
    if deleted_rows_number == 0:
        AssessmentKitLike.objects.create(user=user, assessment_kit=assessment_kit)
    return assessment_kit


def get_maturity_level_with_assessment_kit(assessment_kit_id):
    try:
        kit = AssessmentKit.objects.get(id=assessment_kit_id)
    except AssessmentKit.DoesNotExist as e:
        return False
    result = MaturityLevel.objects.filter(kit_version=kit.kit_version_id)
    return result


def get_list_assessment_kit_for_expert_group(user, expert_group_id):
    results = dict()
    expert_group = expertgroupservice.load_expert_group(expert_group_id)
    results['published'] = expert_group.assessmentkits.filter(is_active=True)
    if expert_group.users.filter(id=user.id).exists():
        results['unpublished'] = expert_group.assessmentkits.filter(is_active=False)
    return results


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
