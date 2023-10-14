const convertToSubjectChartData = (data: any) => {
  return data?.attributes?.map((item:any) => {
    return {
      ml: item?.maturity_level?.value,
      cl: 1,
      title: item?.title,
      id: item?.id,
      mn : data?.subject?.maturity_level?.maturity_levels_count,
    };
  });
};

export default convertToSubjectChartData;
