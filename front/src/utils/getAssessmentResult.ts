const getAssessmentResult = (subjectId: string | undefined, results: any[]) => {
  return results.find((item) => {
    if (item.assessment_project == subjectId) {
      return true;
    }
    return false;
  });
};

export default getAssessmentResult;
