from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status





class CompareAssessmentView(APIView):
    # TODO check authorization
    def post(self, request):
        assessment_list_ids = request.data.get('assessment_list_ids')
        print(len(assessment_list_ids))
        return Response({'error: The '},status=status.HTTP_404_NOT_FOUND)

            