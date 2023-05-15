import json

from django.test import TestCase
from account.models import User
from baseinfo.models.profilemodels import ExpertGroup, AssessmentProfile, ProfileTag
from model_bakery import baker


class TestAssessmentModel(TestCase):
        @classmethod
        def setUpTestData(cls):
            #create expertgroup and user
            user= baker.make(User, email = "test@test.test")
            expert_group = baker.make(ExpertGroup)
            expert_group.users.add(user)
            #creat tags
            tag1 = ProfileTag(code = "c1", title = "devops")
            tag1.save()
            tag2 = ProfileTag(code = "c2", title = "team")
            tag2.save()
            tags = [tag1, tag2]
            #create profile 
            cls.profile = AssessmentProfile.create("cp1", "test title", " test about", "test summary", expert_group, tags,{"var json": "value json"} )

        def test_method_update_setting(self):
            profile_settings = {
                "title" : "test title"
            }
            self.profile.update_settings(profile_settings)
            self.assertEqual(json.loads(self.profile.profile_settings), profile_settings)  