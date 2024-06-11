export const convertToAttributesChartData = (data: any, assessments?: any) => {
  if (!data || !data.attributes) {
    return [];
  }

  const assessmentTitleMap: { [key: string]: string } = {};
  assessments?.forEach((assessment: any) => {
    assessmentTitleMap[assessment.id] = assessment.title;
  });

  return data.attributes.map((attribute: any) => {
    const attributeData: any = {
      index: attribute.index,
      title: attribute.title,
    };

    attribute.assessment?.forEach((item: any, index: number) => {
      const mlKey = `ml${index + 1}`;
      const mlTitle = `ml${index + 1}Title`;
      const assessmentTitleKey = `assessmentTitle${index + 1}`;

      if (item.assessmentId) {
        attributeData[mlKey] = item.maturityLevel.value;
        attributeData[mlTitle] = item.maturityLevel.title;
        attributeData[assessmentTitleKey] =
          assessmentTitleMap[item.assessmentId] || item.assessmentId;
      }
    });

    return attributeData;
  });
};

export const convertToAssessmentsChartData = (data: any, assessments?: any) => {
  if (!data || !data.subjects) {
    return [];
  }

  const assessmentTitleMap: { [key: string]: string } = {};
  assessments?.forEach((assessment: any) => {
    assessmentTitleMap[assessment.id] = assessment.title;
  });

  return data.subjects.map((subject: any, index: number) => {
    const subjectData: any = {
      index: index,
      title: subject.title,
    };

    subject.assessments?.forEach((item: any, index: number) => {
      const mlKey = `ml${index + 1}`;
      const mlTitle = `ml${index + 1}Title`;
      const assessmentTitleKey = `assessmentTitle${index + 1}`;
      if (item?.assessmentId) {
        subjectData[mlKey] = item.maturityLevel.value;
        subjectData[mlTitle] = item.maturityLevel.title;
        subjectData[assessmentTitleKey] =
          assessmentTitleMap[item.assessmentId] || item.assessmentId;
      }
    });

    return subjectData;
  });
};

function groupObjects(arr: any) {
  const result = [];
  for (let i = 0; i < arr.length / 2; i++) {
    const subArray = [arr[i], arr[i + 4]];
    result.push(subArray);
  }
  return result;
}

export function processData(data: any) {
  const attributesChartData = convertToAttributesChartData(data);
  return groupObjects(attributesChartData);
}
