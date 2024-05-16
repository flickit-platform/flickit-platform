import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Paper from "@mui/material/Paper";
import { ESystemStatus, ISubjectInfo, TStatus, IMaturityLevel } from "@types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { styles } from "@styles";
import { Gauge } from "@common/charts/Gauge";
import Title from "@common/Title";
interface IAssessmentOverallStatusProps {
  status: TStatus;
  subjects_info: ISubjectInfo[];
  maturity_level: IMaturityLevel;
  maturity_level_count: number;
  confidence_value?: number;
}

export const AssessmentOverallStatus = (
  props: IAssessmentOverallStatusProps
) => {
  const {
    status,
    subjects_info = [],
    maturity_level,
    maturity_level_count,
    confidence_value,
  } = props;
  return (
    <Box py={3} sx={{ px: { xs: 2, sm: 3 } }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5} sx={{ pt: "0px !important" }}>
          <Gauge
            level_value={maturity_level?.index ?? 0}
            maturity_level_status={maturity_level?.title}
            maturity_level_number={maturity_level_count}
            systemStatus={ESystemStatus[status as ESystemStatus]}
            confidence_value={confidence_value}
            show_confidence={true}
            width="100%"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
