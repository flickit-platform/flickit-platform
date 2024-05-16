import { Box, Typography, BoxProps } from "@mui/material";
import { lazy, Suspense } from "react";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import { TStatus, IMaturityLevel } from "@types";
import getStatusText from "@utils/getStatusText";
import hasStatus from "@utils/hasStatus";
import { Trans } from "react-i18next";
import { styles, getMaturityLevelColors } from "@styles";
import SkeletonGauge from "@common/charts/SkeletonGauge";
interface IGaugeProps extends BoxProps {
  systemStatus?: TStatus;
  name?: string;
  maturity_level_number: number;
  maturity_level_status: string;
  level_value: number;
  confidence_value?: number | null;
  show_confidence?: boolean;
  height?: number;
  className?: string;
  shortTitle?: boolean;
  titleSize?: number;
}

const Gauge = (props: IGaugeProps) => {
  const {
    systemStatus,
    name = "This system",
    maturity_level_status,
    maturity_level_number,
    level_value,
    confidence_value,
    show_confidence,
    height = 200,
    className,
    shortTitle,
    titleSize = 24,
    ...rest
  } = props;
  const colorPallet = getMaturityLevelColors(maturity_level_number);
  const colorCode = colorPallet[level_value - 1];
  const GaugeComponent = lazy(
    () => import(`./GaugeComponent${maturity_level_number}.tsx`)
  );
  const confidenceValue = confidence_value ? confidence_value : 0;

  return (
    <Box p={1} position="relative" width="100%" {...rest}>
      <Suspense fallback={<SkeletonGauge />}>
        <GaugeComponent
          confidence_value={confidence_value}
          show_confidence={show_confidence}
          colorCode={colorCode}
          value={
            level_value !== null && level_value !== undefined ? level_value : -1
          }
          height={height}
          className={className}
        />
      </Suspense>
      {level_value !== null && level_value !== undefined ? (
        <Box
          sx={{
            ...styles.centerCVH,
            bottom: `${show_confidence ? "45%" : shortTitle ? "30%" : "40%"}`,
            left: "25%",
            right: "25%",
          }}
          position="absolute"
        >
          {!show_confidence && !shortTitle && (
            <Typography variant="subtitle2" color="black">
              <Trans i18nKey="thisSystemIsIn" />
            </Typography>
          )}
          <Typography
            sx={{ fontWeight: "bold" }}
            variant="h6"
            color={colorCode}
            fontSize={titleSize}
          >
            {maturity_level_status}
          </Typography>
          {!show_confidence && !shortTitle && (
            <Typography variant="subtitle2" color="black">
              <Trans i18nKey="shape" />
            </Typography>
          )}
          {show_confidence && (
            <Typography
              variant="subtitle2"
              color="#3596A1"
              fontSize="10px"
              mt={1}
            >
              <Trans
                i18nKey="withPercentConfidence"
                // values={{
                //   percent: Math.ceil(confidenceValue),
                // }}
              />
            </Typography>
          )}
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
