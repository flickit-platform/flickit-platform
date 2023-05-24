from rest_framework.permissions import BasePermission

from baseinfo.models.profilemodels import ExpertGroup, AssessmentProfile
from common.abstractservices import load_model

class ManageExpertGroupPermission(BasePermission):
    def has_permission(self, request, view):
        current_user = request.user
        if hasattr(view, 'basename'):
            if view.basename == 'expertgroups':
                if request.method == 'POST':
                    return current_user.has_perm('baseinfo.manage_expert_group')
                elif request.method == 'PUT':
                        return self.check_current_user_is_member_of_expert_group(current_user, view.kwargs.get('pk'))
                else:
                    return True
            elif view.basename == 'expertgroup-user-access':
                if request.method == 'DELETE':
                        return self.check_current_user_is_member_of_expert_group(current_user, view.kwargs.get('expertgroup_pk'))
                else:
                    return True
            return False
        else:
            if 'importprofile' in request.build_absolute_uri():
                 expert_group_id = request.data['expert_group_id']
                 return self.check_current_user_is_member_of_expert_group(current_user, expert_group_id)
            return self.check_current_user_is_member_of_expert_group(current_user, view.kwargs.get('expert_group_id'))       

    def check_current_user_is_member_of_expert_group(self, current_user, expert_group_id):
        expert_group = load_model(ExpertGroup, expert_group_id)
        return current_user.has_perm('baseinfo.manage_expert_group') and expert_group.users.filter(id = current_user.id).exists()
        

class ManageProfilePermission(BasePermission):
    def has_permission(self, request, view):
        current_user = request.user
        if hasattr(view, 'basename'):
            if view.basename == 'profiles':
                if request.method == 'DELETE':
                    profile = load_model(AssessmentProfile, view.kwargs.get('pk'))
                    return self.check_current_user_is_member_of_expert_group(current_user, profile.expert_group.id)
                return True
            return False
        else:
            profile = load_model(AssessmentProfile, view.kwargs.get('profile_id'))
            return self.check_current_user_is_member_of_expert_group(current_user, profile.expert_group_id)
        
             
                   

    def check_current_user_is_member_of_expert_group(self, current_user, expert_group_id):
        expert_group = load_model(ExpertGroup, expert_group_id)
        return current_user.has_perm('baseinfo.manage_expert_group') and expert_group.users.filter(id = current_user.id).exists()