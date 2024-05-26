import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Paper from "@mui/material/Paper";
import { ESystemStatus, ISubjectInfo, TStatus, IMaturityLevel } from "@types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { styles } from "@styles";
import { Gauge } from "@common/charts/Gauge";
import Title from "@common/Title";
import { getNumberBaseOnScreen } from "@/utils/returnBasedOnScreen";
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
    <Box
      height="320px"
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "40px",
      }}
    >
      <Gauge
        level_value={maturity_level?.index ?? 0}
        maturity_level_status={maturity_level?.title}
        maturity_level_number={maturity_level_count}
        systemStatus={ESystemStatus[status as ESystemStatus]}
        confidence_value={confidence_value}
        show_confidence={false}
        display_confidence_component={true}
        shortTitle={true}
        titleSize={getNumberBaseOnScreen(20, 20, 20, 40, 40)}
        height={getNumberBaseOnScreen(140, 140, 200, 280, 340)}
        className="insight--report__gauge"
      />
    </Box>
  );
};
