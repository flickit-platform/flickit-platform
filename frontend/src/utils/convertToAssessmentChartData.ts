import { getMaturityLevelColors } from "@/config/styles";

const convertToAssessmentChartData = (data: any) => {
  return data?.map((item: any) => {
    return {
      ml: item?.maturityLevel?.value,
      cl: 1,
      title: item?.title,
      id: item?.id,
      mn: data?.maturityLevelsCount,
    };
  });
};

export const convertToRadialChartData = (data: any) => {
  return data?.map((item: any) => {
    return {
      ml: item?.maturityLevel?.value,
      cl: 1,
      title: item?.title,
      id: item?.id,
      fill: getMaturityLevelColors(5)[item.maturityLevel.value - 1],
    };
  });
};

export default convertToAssessmentChartData;
