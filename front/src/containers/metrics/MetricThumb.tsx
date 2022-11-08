import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";

export const MetricThumb = (props: any) => {
  const {
    metricsInfo,
    metric = {},
    metricIndex,
    onClose = () => {},
    link,
    isSubmitting,
  } = props;
  const { total_number_of_metrics } = metricsInfo;

  const navigate = useNavigate();
  return (
    <Box py={2.5} px={2.5} minWidth="284px" maxWidth="600px">
      <Box>
        <Typography textTransform={"capitalize"} variant="subMedium">
          <Trans i18nKey={"question"} /> {metricIndex}/{total_number_of_metrics}
        </Typography>
        <Typography variant="h6" fontFamily={"RobotoMedium"}>
          {metric?.title}
        </Typography>
      </Box>
      {metric.answer && (
        <Box mt={3}>
          <Typography variant="subMedium" textTransform="uppercase">
            <Trans i18nKey={"yourAnswer"} />
          </Typography>
          <Typography variant="h6">{metric.answer.caption}</Typography>
        </Box>
      )}
      <Box display="flex">
        <Button
          sx={{ mt: 1, ml: "auto" }}
          disabled={isSubmitting}
          onClick={(e: any) => {
            e.stopPropagation();
            navigate(link);
            onClose();
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
  );
};
