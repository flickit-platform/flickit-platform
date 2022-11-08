import React from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Paper from "@mui/material/Paper";
import { ESystemStatus, ISubjectInfo, TStatus } from "../../types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { getColorOfStatus, styles } from "../../config/styles";
import { Gauge } from "../shared/charts/Gauge";
import Title from "../shared/Title";

interface IAssessmentOverallStatusProps {
  status: TStatus;
  subjects: ISubjectInfo[];
}

export const AssessmentOverallStatus = (
  props: IAssessmentOverallStatusProps
) => {
  const { status, subjects = [] } = props;
  return (
    <Paper elevation={3} sx={{ borderRadius: 3, height: "100%" }}>
      <Box py={3} sx={{ px: { xs: 2, sm: 3 } }}>
        <Title size="small">
          <Trans i18nKey="overAllStatus" />
        </Title>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7} sx={{ pt: "0px !important" }}>
            <Box
              height={"100%"}
              mt={"8px"}
              sx={{ ...styles.centerCV, pt: { xs: 2, lg: "0" } }}
            >
              {subjects.map((subject) => {
                return (
                  <Typography
                    key={subject?.id}
                    sx={{ mb: 0.6 }}
                    fontSize="1.1rem"
                    fontFamily={"RobotoMedium"}
                    letterSpacing=".03em"
                  >
                    <span style={{ textTransform: "uppercase" }}>
                      {subject.title}
                    </span>{" "}
                    <Trans i18nKey={"statusIs"} />{" "}
                    <b
                      style={{
                        color: getColorOfStatus(subject.status, "#747373"),
                      }}
                    >
                      {subject.status || "NOT EVALUATED"}
                    </b>
                  </Typography>
                );
              })}
            </Box>
          </Grid>
          <Grid item xs={12} sm={5} sx={{ pt: "0px !important" }}>
            <Gauge
              sx={{
                mt: { xs: 2, lg: "-16px" },
                ml: "auto",
                mx: { xs: "auto", lg: undefined },
                maxWidth: { xs: "310px", lg: "680px" },
              }}
              systemStatus={ESystemStatus[status as ESystemStatus]}
              width="100%"
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
