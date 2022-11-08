import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";
import { styles } from "../../config/styles";
import {
  EAssessmentStatus,
  metricActions,
  useMetricContext,
  useMetricDispatch,
} from "../../providers/MetricProvider";
import { MetricThumb } from "./MetricThumb";

interface IMetricNextPrevProps {
  hasNextQuestion?: boolean;
  isNext?: boolean;
}

const MetricNextPrev = (props: IMetricNextPrevProps) => {
  const { isNext, hasNextQuestion } = props;
  const { metricsInfo, metricIndex, isSubmitting } = useMetricContext();
  const nextMetric = isNext ? Number(metricIndex) + 1 : Number(metricIndex) - 1;
  const metric = metricsInfo?.metrics?.find(
    (metric) => metric.index == nextMetric
  );
  const dispatch = useMetricDispatch();

  return (
    <Paper
      sx={{
        backgroundColor: "#363636",
        color: "white",
        position: "absolute",
        height: "calc(100% - 80px)",
        width: "calc(100% - 80px)",
        transform: isNext
          ? "translateX(calc(100% - 40px))"
          : "translateX(calc(-100% + 40px))",
        "&": isNext ? { right: 0 } : { left: 0 },
        display: "flex",
        alignItems: "center",
        justifyContent: isNext ? "left" : "right",
        borderRadius: "8px",
        transition: "transform .2s .35s ease",
        flexDirection: isNext ? "row" : "row-reverse",
        zIndex: 5,
        "&:hover": isNext
          ? hasNextQuestion
            ? {
                transform: "translateX(calc(100% - 380px))",
              }
            : {}
          : {
              transform: "translateX(calc(-100% + 380px))",
            },
      }}
    >
      <Box
        height="100%"
        sx={{ ...styles.centerV }}
        component={Link}
        color="#ffffff96"
        onClick={() => {
          if (!isSubmitting && isNext && !hasNextQuestion) {
            dispatch(metricActions.setAssessmentStatus(EAssessmentStatus.DONE));
          }
        }}
        to={
          isSubmitting
            ? ""
            : isNext
            ? hasNextQuestion
              ? `../${metricIndex + 1}`
              : "../completed"
            : `../${metricIndex - 1}`
        }
      >
        <Typography
          sx={{
            transform: isNext ? "rotate(90deg)" : "rotate(-90deg)",
            fontSize: ".85rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            "&": isNext
              ? {
                  marginLeft: "-65px",
                }
              : { marginRight: "-65px" },
          }}
        >
          <Trans i18nKey={isNext ? "skipThisQuestion" : "previousQuestion"} />
        </Typography>
      </Box>
      <Box
        maxWidth="330px"
        flex="1"
        height="100%"
        ml={"-50px"}
        sx={{
          overflowY: "auto",
          "&": isNext ? { ml: "-50px" } : { mr: "-55px", direction: "rtl" },
        }}
      >
        <Box sx={{ direction: "ltr" }}>
          {(!isNext || hasNextQuestion) && (
            <MetricThumb
              metric={metric}
              metricsInfo={metricsInfo}
              metricIndex={nextMetric}
              link={`../${nextMetric}`}
              isSubmitting={isSubmitting}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default MetricNextPrev;
