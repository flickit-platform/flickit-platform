const convertToAttributesChartData = (data: any) => {
  return data?.flatMap((item: any) => {
    return item.attributes.map((att: any,index:number) => {
      return {
        ml: att?.maturity_level?.value,
        cl: 1,
        title: att?.title,
        id: att?.id,
        mn: item?.subject?.maturity_scores?.length,
        index:index
      };
    });
  });
};

export default convertToAttributesChartData;

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
