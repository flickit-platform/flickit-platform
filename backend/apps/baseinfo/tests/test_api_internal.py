import pytest
import json

from rest_framework import status
from rest_framework.test import APIRequestFactory
from baseinfo.views import assessmentkitviews, commonviews
from baseinfo.models.questionmodels import Question, AnswerTemplate


@pytest.mark.django_db
class TestLoadAnswerOptionWithListIds:
    def test_load_answer_option_with_list_when_ids_exist(self, init_data):
        base_info = init_data()
        answer_template = base_info['answer_template']

        api = APIRequestFactory()
        query_params = ""
        query_params += str(answer_template[0].id) + ','
        query_params += str(answer_template[1].id) + ','

        answer_template_list = query_params.split(',')
        answer_template_list = [int(x) for x in answer_template_list if x.isdigit()]
        count = AnswerTemplate.objects.filter(id__in=answer_template_list).count()

        request = api.get(f'/api/internal/v1/answer-options/?ids={query_params}', {}, format='json')
        view = commonviews.LoadAnswerOptionWithlistIdInternalApi.as_view()
        resp = view(request)
        assert resp.status_code == status.HTTP_200_OK
        assert "items" in resp.data
        assert answer_template[0].id == resp.data["items"][0]["id"]
        assert count == len(resp.data["items"])

    def test_load_answer_option_with_list_when_ids_not_exist(self, init_data):
        base_info = init_data()
        api = APIRequestFactory()
        request = api.get(f'/api/internal/v1/answer-options/?ids=1100,100,a,x,2,,,', {}, format='json')
        view = commonviews.LoadAnswerOptionWithlistIdInternalApi.as_view()
        resp = view(request)
        assert resp.status_code == status.HTTP_200_OK
        assert "items" in resp.data
        assert 0 == len(resp.data["items"])

    def test_load_answer_option_with_list_when_ids_not_query_params(self, init_data):
        base_info = init_data()

        api = APIRequestFactory()

        request = api.get(f'/api/internal/v1/answer-options/', {}, format='json')
        view = commonviews.LoadAnswerOptionWithlistIdInternalApi.as_view()
        resp = view(request)
        assert resp.status_code == status.HTTP_200_OK
        assert "items" in resp.data
        assert 0 == len(resp.data["items"])
