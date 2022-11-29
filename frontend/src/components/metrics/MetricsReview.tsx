import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import Title from "../shared/Title";
import { useMetricContext } from "../../providers/MetricProvider";
import assessmentDoneSvg from "../../assets/svg/assessmentDone.svg";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import Hidden from "@mui/material/Hidden";

const MetricsReview = () => {
  const { metricIndex, metricsInfo, assessmentStatus } = useMetricContext();
  return (
    <Box width="100%">
      <Review metrics={metricsInfo.metrics} isReviewPage={true} />
    </Box>
  );
};

export const Review = ({ metrics = [], isReviewPage }: any) => {
  const navigate = useNavigate();
  return (
    <Box
      maxWidth={"1440px"}
      sx={{ px: { xs: 1, sm: 2, md: 6 }, my: { xs: 1, md: 3 }, mx: "auto" }}
    >
      {!isReviewPage && (
        <Box mb={6} mt={6} p={0.5}>
          <Typography
            variant="h4"
            sx={{
              opacity: 0.8,
              mb: 4,
              fontFamily: "RobotoBold",
              fontWeight: "bolder",
            }}
            textTransform={"uppercase"}
          >
            <Trans i18nKey="youFinishedQuestionnaire" />
          </Typography>
          <Typography variant="h5" fontFamily="RobotoBold">
            <Trans i18nKey="youCan" />{" "}
            <Button
              startIcon={<QueryStatsRoundedIcon />}
              variant="contained"
              size="large"
              component={Link}
              to={"./../../../insights"}
            >
              <Trans i18nKey="viewInsights" />
            </Button>{" "}
            <Trans i18nKey="now" />.
          </Typography>
          <Hidden smDown>
            <Box display="flex" justifyContent={"flex-end"}>
              <Box width="480px" mt="-64px">
                <img
                  src={assessmentDoneSvg}
                  alt="assessment done"
                  style={{ width: "100%" }}
                />
              </Box>
            </Box>
          </Hidden>
        </Box>
      )}
      <Box>
        {!isReviewPage && (
          <Title>
            <Trans i18nKey="review" />
          </Title>
        )}
        <Box mt={2}>
          {metrics.map((metric: any) => {
            return (
              <Paper
                key={metric.id}
                sx={{
                  p: 3,
                  backgroundColor: "#273248",
                  flex: 1,
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                  mb: 2,
                  borderRadius: "8px",
                }}
                elevation={3}
              >
                <Box>
                  <Box>
                    <Typography
                      textTransform={"capitalize"}
                      variant="subMedium"
                      sx={{ color: "#b3b3b3" }}
                    >
                      <Trans i18nKey={"question"} />
                    </Typography>
                    <Typography variant="h6" fontFamily={"RobotoBold"}>
                      {metric.title}
                    </Typography>
                  </Box>
                  {metric.answer && (
                    <Box mt={3}>
                      <Typography
                        variant="subMedium"
                        textTransform="uppercase"
                        sx={{ color: "#b3b3b3" }}
                      >
                        <Trans i18nKey={"yourAnswer"} />
                      </Typography>
                      <Typography variant="h6" fontFamily={"RobotoBold"}>
                        {metric.answer.caption}
                      </Typography>
                    </Box>
                  )}
                  <Box display="flex" mt={2}>
                    <Button
                      variant="contained"
                      sx={{ mt: 0.2, ml: "auto" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          isReviewPage
                            ? `./../${metric.index}`
                            : `../${metric.index}`
                        );
                      }}
                    >
                      {metric.answer ? (
                        <Trans i18nKey="edit" />
                      ) : (
                        <Trans i18nKey="submitAnAnswer" />
                      )}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default MetricsReview;
