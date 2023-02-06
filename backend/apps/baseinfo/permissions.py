from rest_framework.permissions import BasePermission

class ManageExpertGroupPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method in ('POST', 'PUT', 'DELETE') or 'inspectprofile' in request.build_absolute_uri():
            return request.user.has_perm('baseinfo.manage_expert_group')
        else:
            return True
