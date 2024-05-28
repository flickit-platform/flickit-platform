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
      const assessmentTitleKey = `assessmentTitle${index + 1}`;

      if (item.assessmentId) {
        attributeData[mlKey] = item.maturityLevelValue;
        attributeData[assessmentTitleKey] =
          assessmentTitleMap[item.assessmentId] || item.assessmentId;
      }
    });

    return attributeData;
  });
};

export const convertToGeneralChartData = (data: any) => {
  return data?.assessments.map((assessment: any) => {
    return {
      ml: assessment?.maturityLevel?.value,
      cl: assessment?.confidenceValue,
      title: assessment?.title,
      id: assessment?.id,
      mn: assessment?.maturityLevel?.maturityLevelCount,
      index: assessment?.maturityLevel?.index,
    };
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
