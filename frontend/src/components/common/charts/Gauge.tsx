import { Box, Typography, BoxProps } from "@mui/material";
import { lazy, Suspense } from "react";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import { TStatus, IMaturityLevel } from "@types";
import getStatusText from "@utils/getStatusText";
import hasStatus from "@utils/hasStatus";
import { Trans } from "react-i18next";
import { styles, getMaturityLevelColors } from "@styles";
import GaugeComponent5 from "@common/charts/GaugeComponent5";
interface IGaugeProps extends BoxProps {
  systemStatus: TStatus;
  name?: string;
  maturity_level_number: number;
  maturity_level_status: string;
  level_value: number;
}

const Gauge = (props: IGaugeProps) => {
  const {
    systemStatus,
    name = "This system",
    maturity_level_status,
    maturity_level_number,
    level_value,
    ...rest
  } = props;
  const colorPallet = getMaturityLevelColors(maturity_level_number);
  const colorCode = colorPallet[level_value - 1];
  const GaugeComponent = lazy(
    () => import(`./GaugeComponent${maturity_level_number}.tsx`) 
  );
  return (
    <Box p={1} position="relative" width="100%" {...rest}>
      <Suspense fallback={<GaugeComponent5 colorCode="#000" value={-1} />}>
        <GaugeComponent
          colorCode={colorCode}
          value={
            level_value !== null && level_value !== undefined ? level_value : -1
          }
        />
      </Suspense>
      {level_value !== null && level_value !== undefined ? (
        <Box
          sx={{ ...styles.centerCVH, bottom: "40%", left: "25%", right: "25%" }}
          position="absolute"
        >
          <Typography variant="subtitle2" color="black">
            <Trans i18nKey="thisSystemIsIn" />
          </Typography>
          <Typography
            sx={{ fontWeight: "bold" }}
            variant="h5"
            color={colorCode}
          >
            {maturity_level_status}
          </Typography>
          <Typography variant="subtitle2" color="black">
            <Trans i18nKey="shape" />
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{ ...styles.centerCVH, bottom: "50%", left: "25%", right: "25%" }}
          position="absolute"
        >
          <Typography
            sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
            variant="h5"
            color="GrayText"
          >
            <Trans i18nKey="notEvaluated" />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export { Gauge };
