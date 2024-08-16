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
import { t } from "i18next";

interface IAssessmentOverallStatusProps {
  status?: TStatus;
  subjects_info?: ISubjectInfo[];
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
      height="100%"
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "32px",
      }}
    >
      <Gauge
        level_value={maturity_level?.index ?? 0}
        maturity_level_status={maturity_level?.title}
        maturity_level_number={maturity_level_count}
        confidence_value={confidence_value}
        confidence_text={t("withPercentConfidence")}
        isMobileScreen={false}
        hideGuidance={true}
        height={getNumberBaseOnScreen(340, 440, 440, 360, 360)}
        mb="-36px"
        className="insight--report__gauge"
        maturity_status_guide={t("overallMaturityLevelIs")}
      />
    </Box>
  );
};
