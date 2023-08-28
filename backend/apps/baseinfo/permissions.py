from urllib.parse import urlsplit
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError

from baseinfo.models.assessmentkitmodels import ExpertGroup, AssessmentKit
from common.abstractservices import load_model

class ExpertGroupPermission(BasePermission):
    
    def get_expert_group_id_with_assessment_kit(self,view):
        assessment_kit = load_model(AssessmentKit, view.kwargs.get('pk'))
        return assessment_kit.expert_group_id
    
    def get_expert_group_id_with_assessment_kit_id_with_error(self,view):
        try:
            assessment_kit = AssessmentKit.objects.get(id = view.kwargs.get('assessment_kit_id'))
        except AssessmentKit.DoesNotExist as e:
            raise ValidationError({"code": "NOT_FOUND",'message' :"'assessment_kit_id' does not exist"})
        return assessment_kit.expert_group_id

    def get_expert_group_id_with_assessment_kit_id(self,view):
        assessment_kit = load_model(AssessmentKit, view.kwargs.get('assessment_kit_id'))
        return assessment_kit.expert_group_id
    
    def get_expert_group_id_in_basename_expert_groups(self, view):
        return  view.kwargs.get('pk')
    
    def get_expert_group_id_in_basename_expert_groups_access(self, view):
        return  view.kwargs.get('expertgroup_pk')

    def get_expert_group_id_in_basename_expert_groups_id(self, view):
        return  view.kwargs.get('expert_group_id')
    
    def get_expert_group_id_in_body_request(self, view):
        return view.request.data['expert_group_id']
    
    def check_basename(self,url ):
        url_parts = urlsplit(url)
        path = url_parts.path
        paths = path.split("/")
        if paths[1] == "baseinfo" and paths[2] in self.request_url :
            return paths[2]

        elif paths[1] == "api" and paths[3] in self.request_url :
            return paths[3]
        return None
    
    def check_current_user_is_member_of_expert_group(self, current_user, expert_group_id):
        expert_group = load_model(ExpertGroup, expert_group_id)
        return  expert_group.users.filter(id = current_user.id).exists()
        
    def check_current_user_is_owner_of_expert_group(self, current_user, expert_group_id):
        expert_group = load_model(ExpertGroup, expert_group_id)
        return  expert_group.owner_id == current_user.id
    
    request_url = {
        "importassessmentkit" : get_expert_group_id_in_body_request,
        "addexpertgroup" : get_expert_group_id_in_basename_expert_groups_id,
        "analyzeassessmentkit":get_expert_group_id_with_assessment_kit_id,
        "inspectassessmentkit":get_expert_group_id_with_assessment_kit_id,
        "assessmentkits":get_expert_group_id_with_assessment_kit_id,
        "assessment-kits":get_expert_group_id_with_assessment_kit_id_with_error,
    }
    basename_url = {
        "expertgroups" : get_expert_group_id_in_basename_expert_groups,
        "expertgroup-user-access" : get_expert_group_id_in_basename_expert_groups_access,
        "assessmentkits" : get_expert_group_id_with_assessment_kit,
    }

class IsMemberExpertGroup(ExpertGroupPermission):
    
    def has_permission(self, request, view):
        current_user = request.user
        if hasattr(view, 'basename'):
            if view.basename in self.basename_url:
                func = self.basename_url[view.basename]
                return self.check_current_user_is_member_of_expert_group(current_user, func(self,view))
        else:
            baseurl = self.check_basename(request.build_absolute_uri())
            if baseurl != None:
                func = self.request_url[baseurl]
                return self.check_current_user_is_member_of_expert_group(current_user, func(self,view))
        return False

class IsOwnerExpertGroup(ExpertGroupPermission):
    def has_permission(self, request, view):
        current_user = request.user
        if hasattr(view, 'basename',):
            if view.basename in self.basename_url:
                func = self.basename_url[view.basename]
                return self.check_current_user_is_owner_of_expert_group(current_user, func(self,view))
        else:
            baseurl = self.check_basename(request.build_absolute_uri())
            if baseurl != None:
                func = self.request_url[baseurl]
                return self.check_current_user_is_owner_of_expert_group(current_user, func(self,view))

class Manage_expert_group(BasePermission):
    def has_permission(self,request,view):
        current_user = request.user
        return current_user.has_perm('baseinfo.manage_expert_group')