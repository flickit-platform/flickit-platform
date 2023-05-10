from rest_framework.permissions import BasePermission

from baseinfo.models.profilemodels import ExpertGroup
from common.abstractservices import load_model

class ManageExpertGroupPermission(BasePermission):
    def has_permission(self, request, view):
        current_user = request.user
        if view.basename == 'expertgroups':
            if request.method == 'POST':
                return current_user.has_perm('baseinfo.manage_expert_group')
            elif request.method == 'PUT':
                    return self.check_current_user_is_member_of_expert_group(current_user, view.kwargs.get('pk'))
            else:
                return True
        elif view.basename == 'expertgroup-user-access':
            if request.method == 'DELETE':
                    return self.check_current_user_is_member_of_expert_group(current_user, view.kwargs.get('pk'))
        
        else:
            return False
        

        # current_user = request.user
        # if not current_user.has_perm('baseinfo.manage_expert_group'):
        #     return False
        # profile_id = view.kwargs.get('profile_id')
        # if profile_id is not None:
        #     profile = load_model(AssessmentProfile, profile_id)
        #     return profile.expert_group.users.filter(id = current_user.id).exists()           

    def check_current_user_is_member_of_expert_group(self, current_user, expert_group_id):
        expert_group = load_model(ExpertGroup, expert_group_id)
        return current_user.has_perm('baseinfo.manage_expert_group') and expert_group.users.filter(id = current_user.id).exists()
        

