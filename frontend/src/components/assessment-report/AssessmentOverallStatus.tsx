import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Paper from "@mui/material/Paper";
import { ESystemStatus, ISubjectInfo, TStatus, IMaturityLevel } from "@types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { getMaturityLevelColors, styles } from "@styles";
import { Gauge } from "@common/charts/Gauge";
import Title from "@common/Title";
interface IAssessmentOverallStatusProps {
  status: TStatus;
  subjects_info: ISubjectInfo[];
  maturity_level: IMaturityLevel;
  maturity_level_count: number;
}

export const AssessmentOverallStatus = (
  props: IAssessmentOverallStatusProps
) => {
  const {
    status,
    subjects_info = [],
    maturity_level,
    maturity_level_count,
  } = props;
  const colorPallet = getMaturityLevelColors(maturity_level_count || 0);
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
              {subjects_info.map((subject) => {
                return (
                  <Typography
                    key={subject?.id}
                    sx={{ mb: 0.6 }}
                    fontSize="1.1rem"
                    fontFamily={"Roboto"}
                    fontWeight={500}
                    letterSpacing=".03em"
                  >
                    <span style={{ textTransform: "uppercase" }}>
                      {subject.title}
                    </span>{" "}
                    <Trans i18nKey={"statusIs"} />{" "}
                    <b
                      data-cy={"status"}
                    >
                      {subject?.maturity_level?.title || "NOT EVALUATED"}
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
              level_value={maturity_level?.index || 0}
              maturity_level_status={maturity_level?.title}
              maturity_level_number={maturity_level_count}
              systemStatus={ESystemStatus[status as ESystemStatus]}
              width="100%"
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
