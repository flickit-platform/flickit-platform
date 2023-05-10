from django.test import TestCase
from baseinfo.services import profileservice
from account.models import User, Space, UserAccess
from baseinfo.models.profilemodels import ExpertGroup, AssessmentProfile, ProfileTag
from model_bakery import baker


        