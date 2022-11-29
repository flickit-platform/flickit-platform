import React from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import QueryData from "../shared/QueryData";
import Title from "../shared/Title";
import CompareResult from "./CompareResult";
import { ICompareResultModel } from "../../types";

const CompareResultContainer = () => {
  const [searchParams] = useSearchParams();
  const assessmentIds = searchParams.getAll("assessmentIds");
  const { service } = useServiceContext();
  const compareResultQueryData = useQuery<ICompareResultModel>({
    service: (args = { assessmentIds }, config) =>
      service.fetchCompareResult(args, config),
    toastError: true,
  });

  return (
    <QueryData
      {...compareResultQueryData}
      render={(data) => {
        return (
          <Box>
            <Title borderBottom={true}>
              <Trans i18nKey="theResultOfComparing" />{" "}
              <Box sx={{ ml: { xs: 0, sm: 1 } }} display="inline">
                {data.base_infos.map((item: any, index: number) => (
                  <>
                    {item.title}
                    {index < data.base_infos.length - 1 ? " and" : ""}{" "}
                  </>
                ))}
              </Box>
            </Title>
            <CompareResult data={data} />{" "}
          </Box>
        );
      }}
    />
  );
};

export default CompareResultContainer;
