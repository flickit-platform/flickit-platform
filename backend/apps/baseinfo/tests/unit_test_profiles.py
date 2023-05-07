from django.test import TestCase
from baseinfo.services import profileservice
from account.models import User, Space, UserAccess
from baseinfo.models.profilemodels import ExpertGroup, AssessmentProfile, ProfileTag
from model_bakery import baker


class TestFunctionExtractProfileTags(TestCase):
    @classmethod
    def setUpTestData(self):
        #create expertgroup and user
        user = baker.make(User, email = "test@test.test")
        expert_group = baker.make(ExpertGroup)
        expert_group.users.add(user)
        
        #creat tags
        tag1 = ProfileTag(code = "c1", title = "devops")
        tag1.save()
        tag2 = ProfileTag(code = "c2", title = "team")
        tag2.save()
        tags = [tag1, tag2]
        #create profile 
        profile = AssessmentProfile()
        profile.code = "cp1"
        profile.title = "test title"
        profile.about = "test about"
        profile.summary = "test summary"
        profile.expert_group = expert_group
        profile.save()
        for tag in tags:
            profile.tags.add(tag)
        profile.save()        

    def test_extract_profile_report_infos(self):
        tag_results = {}
        profile = AssessmentProfile.objects.get(code = "cp1")
        results = profileservice.extract_profile_report_infos(profile)
        for item in results:
            if item["title"] == "Tags":
                tag_results = item
        self.assertEqual(tag_results["item"][0]["id"], 1)
        self.assertEqual(tag_results["item"][0]["title"], "devops")
        self.assertEqual(tag_results["item"][1]["id"], 2)
        self.assertEqual(tag_results["item"][1]["title"], "team")
        self.assertEqual(len(tag_results["item"]), 2)
        