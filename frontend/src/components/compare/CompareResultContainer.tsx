import React from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import QueryData from "../shared/QueryData";
import Title from "../shared/Title";
import CompareResult from "./CompareResult";
import { ICompareResultModel } from "../../types";
import Button from "@mui/material/Button";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";

const CompareResultContainer = () => {
  const [searchParams] = useSearchParams();
  const assessmentIds = searchParams.getAll("assessmentIds");
  const { service } = useServiceContext();
  const compareResultQueryData = useQuery<ICompareResultModel>({
    service: (args = { assessmentIds }, config) =>
      service.fetchCompareResult(args, config),
    toastError: true,
  });
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <QueryData
      {...compareResultQueryData}
      render={(data) => {
        return (
          <Box>
            <Title
              borderBottom={true}
              toolbar={
                <Button
                  startIcon={<BorderColorRoundedIcon />}
                  size="small"
                  onClick={() =>
                    navigate({ pathname: "/compare", search: location.search })
                  }
                >
                  <Trans i18nKey="editComparisonItems" />
                </Button>
              }
            >
              <Trans i18nKey="theResultOfComparing" />{" "}
              <Box sx={{ ml: { xs: 0, sm: 1 } }} display="inline">
                {data.base_infos.map((item: any, index: number) => (
                  <>
                    {item.title}
                    {getConjunction(data.base_infos?.length, index)}{" "}
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

const getConjunction = (length: number, index: number) => {
  return index < length - 1 ? (
    <>
      {" "}
      <Trans i18nKey="and" />
    </>
  ) : (
    ""
  );
};

export default CompareResultContainer;
