import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  CardHeader,
  Paper,
  Typography, 
} from "@mui/material";
import { Trans } from "react-i18next";
import { useNavigate, useLocation, useSearchParams,Link } from "react-router-dom";
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
  const assessmentIds = searchParams.getAll("assessmentIds");
  const { service } = useServiceContext();
  const [compareResult, setCompareResult] = useState<any>([]);
  const compareResultQueryData = useQuery<ICompareResultModel>({
    service: (args, config) => service.fetchAssessment(args, config),
    toastError: true,
    runOnMount: false,
  });
  const combineCompareResult = async (id: any) => {
    try {
      const res = await compareResultQueryData.query({
        assessmentId: id,
      });
      setCompareResult((prevT: any) => [...prevT, res]);
    } catch (e) {
      // const err = e as ICustomError;
      // toastError(err);
    }
  };

  useEffect(() => {
    assessmentIds.map((id: any) => {
      combineCompareResult(id);
    });
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  return (
          <Box>
            <Title
              borderBottom={true}
              toolbar={
                <Button
                  startIcon={<BorderColorRoundedIcon />}
                  size="small"
                  onClick={() => navigate({ pathname: "/compare", search: location.search })}
                >
                  <Trans i18nKey="editComparisonItems" />
                </Button>
              }
            >
              <Trans i18nKey="comparisonResult" />{" "}
            </Title>
            <Paper
              elevation={2}
              sx={{ width: "100%", borderRadius: 3, py: 3, mt: 4, px: 2 }}
            >
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "6px",
                  fontWeight: "bold",
                  textDecoration: "none",
                  height: "100%",
                  display: {
                    xs: "block",
                    sm: "block",
                    md: "flex",
                    lg: "flex",
                  },
                  alignItems: "center",
                  alignSelf: "stretch",
                }}
              >
                <Trans i18nKey="theAssessmentKitUsedInTheseAssessmentsIs" />
                {compareResult[0] && (
                  <Box
                    component={Link}
                    to={`/assessment-kits/${compareResult[0]?.assessment?.assessment_kit?.id}`}
                    sx={{
                      // color: (t) => t.palette.primary.dark,
                      textDecoration: "none",
                      ml: 0.5,
                    }}
                  >
                    {compareResult[0]?.assessment?.assessment_kit?.title}
                  </Box>
                )}
              </Typography>
              {compareResult[0] && (
                <Typography color="GrayText" variant="body2">
                  {compareResult[0]?.assessment?.assessment_kit?.summary}
                </Typography>
              )}
              {compareResult[0] && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    ml: "auto",
                    // mr: 2,
                    textDecoration: "none",
                    justifyContent: "flex-end",
                  }}
                  component={Link}
                  to={`/user/expert-groups/${compareResult[0]?.assessment?.assessment_kit.expert_group?.id}`}
                >
                  <Typography
                    color="grayText"
                    variant="subLarge"
                    sx={{ fontSize: { xs: "0.6rem", md: "0.8rem" } }}
                  >
                    <Trans i18nKey="providedBy" />
                  </Typography>
                  <CardHeader
                    sx={{ p: 0, ml: 1.8 }}
                    titleTypographyProps={{
                      sx: { textDecoration: "none" },
                    }}
                    avatar={
                      <Avatar
                        sx={{
                          width: { xs: 30, sm: 40 },
                          height: { xs: 30, sm: 40 },
                        }}
                        alt={compareResult[0]?.assessment?.assessment_kit.expert_group?.name}
                        // src={expert_group?.picture || "/"}
                      />
                    }
                    title={
                      <Box
                        component={"b"}
                        sx={{ fontSize: { xs: "0.6rem", md: "0.95rem" } }}
                        color="Gray"
                      >
                        {compareResult[0]?.assessment?.assessment_kit.expert_group?.name}
                      </Box>
                    }
                  />
                </Box>
              )}
            </Paper>
            <CompareResult data={compareResult} />{" "}
          </Box>
        );
};

export default CompareResultContainer;
