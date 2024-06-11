import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Title from "@common/Title";
import Typography from "@mui/material/Typography";
import SubjectOverallStatusLevelChart from "./SubjectOverallStatusLevelChart";
import { Gauge } from "../common/charts/Gauge";
import { getNumberBaseOnScreen } from "@/utils/returnBasedOnScreen";

const SubjectOverallInsight = ({ data }: any) => {
  const {
    attributes,
    subject,
    topStrengths,
    topWeaknesses,
    maturityLevelsCount,
  } = data;
  const { maturityLevel, confidenceValue } = subject;
  return (
    <Box
      height="100%"
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "40px",
      }}
    >
      <Grid container spacing={2} columns={12} mt={0.2} alignItems="stretch">
        <Grid item lg={7} md={12} sm={12} xs={12}></Grid>
        <Grid item lg={5} md={12} sm={12} xs={12}>
          <Gauge
            level_value={maturityLevel?.value ?? 0}
            maturity_level_status={maturityLevel?.title}
            maturity_level_number={5}
            confidence_value={confidenceValue}
            display_confidence_component={true}
            isMobileScreen={false}
            hideGuidance={true}
            height={getNumberBaseOnScreen(340, 440, 440, 380, 440)}
            mb="-8%"
            mt="8%"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubjectOverallInsight;
