import random
import string
from datetime import datetime

from django.contrib.auth import get_user_model
from django.test import TestCase
from account.models import UserAccess ,Space
from ..services import spaceservices

class SpaceTeset(TestCase):
    
    @classmethod
    def setUpTestData(cls):
        cls.user_owner_space=get_user_model().objects.create_user(
            email="owner@a.aaa",
            password="root",
            display_name="owner",
                                
        )
        cls.user_Guest_space=get_user_model().objects.create_user(
            
            email="guest@a.aaa",
            password="root",
            display_name="guest",                                 
        )
        alphabet = string.digits
        cls.space=Space()
        cls.space = Space()
        cls.space.code = ''.join(random.choice(alphabet) for _ in range(6))
        cls.space.title = cls.user_owner_space.display_name + '_default_space'
        cls.space.owner = cls.user_owner_space
        cls.space.save()
        spaceservices.add_owner_to_space(cls.space, cls.user_owner_space.id)
        spaceservices.add_invited_user_to_space(cls.user_owner_space)
        UserAccess.objects.create(space_id = cls.space.id,user = cls.user_Guest_space)
    
    def test_leave_user_space(self):
        result = spaceservices.leave_user_space(self.space.id, self.user_Guest_space)
        self.assertEqual(result.message,"Leaving from the space is done successfully")
        result = spaceservices.leave_user_space(self.space.id, self.user_Guest_space)
        self.assertEqual(result.message,"There is no such user and space")
    
    
