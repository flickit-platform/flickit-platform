from rest_framework.views import exception_handler
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from rest_framework.exceptions import PermissionDenied
from django.db import IntegrityError
from rest_framework import status
from django.http import Http404
from rest_framework.exceptions import NotAuthenticated, AuthenticationFailed

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    if response is None:
        if isinstance(exc, ObjectDoesNotExist):
            data = {'message': 'Object does not exists'}
            return Response(data, status=status.HTTP_404_NOT_FOUND)
        elif isinstance(exc, ValidationError):
            data = {'message': exc.message}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        elif isinstance(exc, IntegrityError):
            data = {'message': 'Integrity Error, check the request body and try again'}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        elif isinstance(exc, Http404):
            data = {'message': 'Not found.'}
            return Response(data, status=status.HTTP_404_NOT_FOUND)
        elif isinstance(exc, PermissionDenied):
            data = {'message': 'Permission Denied.'}
            return Response(data, status=status.HTTP_403_FORBIDDEN)
        elif isinstance(exc, AuthenticationFailed):
            data = {'message': 'Authentication Failed.'}
            return Response(data, status=status.HTTP_401_UNAUTHORIZED)
        elif isinstance(exc, NotAuthenticated):
            data = {'message': 'Not Authenticated.'}
            return Response(data, status=status.HTTP_401_UNAUTHORIZED)
    else:
        if isinstance(exc, PermissionDenied):
            data = {'message': 'You do not have permission to perform this action.'}
            return Response(data, status=status.HTTP_403_FORBIDDEN)
    return response
