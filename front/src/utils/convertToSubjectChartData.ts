import React from "react";

const convertToSubjectChartData = (data: any[]) => {
  return data.map((item) => {
    return {
      ml: item?.maturity_level_value,
      cl: 1,
      title: item?.quality_attribute?.title,
      id: item?.quality_attribute?.id,
    };
  });
};

export default convertToSubjectChartData;
