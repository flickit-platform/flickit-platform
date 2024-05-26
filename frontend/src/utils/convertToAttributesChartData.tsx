export const convertToAttributesChartData = (data: any) => {
  console.log(data);
  return data?.attributes.map((attribute: any) => {
    attribute?.assessment.map((item: any) => {
      return {
        ml: item?.maturityLevelValue,
        cl: 1,
        title: "title",
        id: item?.assessmentId,
        mn: 5,
        index: attribute?.index,
      };
    });
  });
};

export const convertToGeneralChartData = (data: any) => {
  console.log(data);
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
