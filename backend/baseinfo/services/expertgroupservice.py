from ..models.profilemodels import ExpertGroup



def load_expert_group(expert_group_id) -> ExpertGroup:
    try:
        return ExpertGroup.objects.get(id = expert_group_id)
    except ExpertGroup.DoesNotExist:
        return None