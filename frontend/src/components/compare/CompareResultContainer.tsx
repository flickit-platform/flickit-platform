import { useEffect, useState } from "react";
import { Avatar, Box, CardHeader, Paper, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import {
  useNavigate,
  useLocation,
  useSearchParams,
  Link,
} from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import QueryData from "@common/QueryData";
import Title from "@common/Title";
import CompareResult from "./CompareResult";
import { ICompareResultModel } from "@types";
import Button from "@mui/material/Button";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";

const CompareResultContainer = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { service } = useServiceContext();
  const compareResultQueryData = useQuery<ICompareResultModel>({
    service: (args, config) =>
      service.comparessessments({ data: location.search }, config),
  });
  const calculateMaturityLevelQuery = useQuery<any>({
    service: (args, config) => service.calculateMaturityLevel(args, config),
    runOnMount: false,
  });
  const calculateConfidenceLevelQuery = useQuery({
    service: (args, config) => service.calculateConfidenceLevel(args, config),
    runOnMount: false,
  });
  
  const navigate = useNavigate();
  return (
    <QueryData
      {...compareResultQueryData}
      render={(data) => {
        const {assessments,subjects}=data
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
              <Trans i18nKey="comparisonResult" />{" "}
            </Title>
      
            <CompareResult data={data} />
          </Box>
        );
      }}
    />
  );
};

export default CompareResultContainer;
