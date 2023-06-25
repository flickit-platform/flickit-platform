

from functools import wraps
from django.shortcuts import get_object_or_404

from baseinfo.models.assessmentkitmodels import ExpertGroup
from baseinfo.services import expertgroupservice

def is_expert(func):
    @wraps(func)
    def wrap(self, request, *args, **kwargs):
        expert_group_id = kwargs.get('expert_group_id')
        expert_group = get_object_or_404(ExpertGroup, pk=expert_group_id)
        if expertgroupservice.is_current_user_expert(expert_group, request.user):
            response = func(self, request, *args, **kwargs)
            response.data['is_expert'] = True
            return response
        else:
            response = func(self, request, *args, **kwargs)
            response.data['is_expert'] = False
            return response
    return wrap