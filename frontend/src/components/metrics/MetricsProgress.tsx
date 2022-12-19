import React from "react";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Hidden from "@mui/material/Hidden";
import LinearProgress from "@mui/material/LinearProgress";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { styles } from "../../config/styles";
import {
  EAssessmentStatus,
  metricActions,
  useMetricContext,
  useMetricDispatch,
} from "../../providers/MetricProvider";
import usePopover from "../../utils/usePopover";
import Typography from "@mui/material/Typography";
import { MetricThumb } from "./MetricThumb";
import { MetricPopover } from "./MetricPopover";

const MetricsProgress = ({ hasNextQuestion, hasPreviousQuestion }: any) => {
  const { assessmentStatus, metricIndex, metricsInfo, isSubmitting } =
    useMetricContext();
  const { total_number_of_metrics, metrics = [] } = metricsInfo;
  const dispatch = useMetricDispatch();
  const { metricIndex: metricParam } = useParams();
  const isFinish = metricParam === "completed";

  return (
    <Box
      position="relative"
      sx={{ mt: { xs: 1, sm: 3 }, mx: { xs: 0, sm: "24px" } }}
    >
      <Hidden
        smDown
        mdDown={metrics.length > 25 ? true : false}
        xlDown={metrics.length > 30 ? true : false}
      >
        <Box
          position={"absolute"}
          sx={{
            ...styles.centerV,
            width: { xs: "100%", sm: "calc(100% - 24px)" },
          }}
          height="100%"
          justifyContent="space-evenly"
        >
          {metrics.map((metric) => {
            return (
              <MetricProgressItem
                isSubmitting={isSubmitting}
                key={metric.id}
                metric={metric}
                metricsInfo={metricsInfo}
                to={`./../${metric.index}`}
              />
            );
          })}
        </Box>
      </Hidden>
      <Box sx={{ ...styles.centerV, px: { xs: 0.5, sm: 0 } }}>
        <Hidden
          smUp={metrics.length > 25 ? false : true}
          mdUp={metrics.length > 25 && metrics.length <= 30 ? true : false}
          xlUp={metrics.length > 30 ? true : false}
        >
          <Button
            size="small"
            disabled={!hasPreviousQuestion || isSubmitting}
            sx={{ minWidth: 0, mr: "1px" }}
            component={Link}
            to={`../${metricIndex - 1}`}
          >
            <Trans i18nKey={isFinish ? "edit" : "prev"} />
          </Button>
        </Hidden>
        <LinearProgress
          sx={{ flex: 1, borderRadius: 4 }}
          variant="determinate"
          value={
            assessmentStatus === EAssessmentStatus.DONE
              ? 100
              : (100 / (total_number_of_metrics + 1)) * metricIndex
          }
        />
        <Hidden
          smUp={metrics.length > 25 ? false : true}
          mdUp={metrics.length > 25 && metrics.length <= 30 ? true : false}
          xlUp={metrics.length > 30 ? true : false}
        >
          <Button
            size="small"
            disabled={isFinish || isSubmitting}
            sx={{ minWidth: 0, ml: "1px" }}
            component={Link}
            to={hasNextQuestion ? `../${metricIndex + 1}` : "../completed"}
            onClick={() => {
              if (!hasNextQuestion) {
                dispatch(
                  metricActions.setAssessmentStatus(EAssessmentStatus.DONE)
                );
              }
            }}
          >
            <Trans i18nKey={"skip"} />
          </Button>
        </Hidden>
      </Box>
    </Box>
  );
};

export const MetricProgressItem = (props: any) => {
  const { metricsInfo, metric, to } = props;
  const { total_number_of_metrics } = metricsInfo;

  const { metricIndex } = useParams();
  const { handleClick, ...popoverProps } = usePopover();

  return (
    <Box
      sx={{
        width: "20px",
        zIndex: 1,
        height: "20px",
        cursor: metricIndex != metric.index ? "pointer" : "auto",
        backgroundColor: (t: any) =>
          metric.answer ? `${t.palette.primary.main}` : "white",
        border: (t: any) => `3px solid white`,
        outline: (t: any) =>
          `${metric.answer ? t.palette.primary.main : "#a7caed"} solid 5px`,
        transition: "background-color .3s ease, transform .2s ease",
        borderRadius: "8px",
        transform: metric.index == metricIndex ? "scale(1.3)" : "scale(.9)",
        "&:hover p.i-p-i-n": {
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{ zIndex: 1, width: "100%", height: "100%" }}
        onClick={(e: any) => {
          metricIndex != metric.index && handleClick(e);
        }}
      >
        <Typography
          sx={{
            fontSize: metric.index == metricIndex ? ".75rem" : ".7rem",
            textAlign: "center",
            lineHeight: "13px",
            fontFamily: "Roboto",
            opacity: metric.index == metricIndex ? 1 : 0.6,
            color: metric.answer ? `white` : "gray",
            transition: "opacity .1s ease",
          }}
          className="i-p-i-n"
        >
          {metric.index}
        </Typography>
      </Box>
      <MetricPopover {...popoverProps}>
        <MetricThumb
          {...props}
          onClose={popoverProps.onClose}
          metricIndex={metric.index}
          link={to || `${metric.index}`}
        />
      </MetricPopover>
    </Box>
  );
};

export { MetricsProgress };
