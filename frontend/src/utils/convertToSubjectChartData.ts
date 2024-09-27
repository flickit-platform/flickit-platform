const convertToSubjectChartData = (data: any) => {
  return data?.attributes?.map((item:any) => {
    return {
      ml: item?.maturityLevel?.value,
      cl: 1,
      title: item?.title,
      id: item?.id,
      mn : data?.maturityLevelsCount,
    };
  });
};

export default convertToSubjectChartData;
