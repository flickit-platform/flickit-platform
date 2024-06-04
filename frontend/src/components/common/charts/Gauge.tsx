import { Box, Typography, BoxProps, Tooltip } from "@mui/material";
import { lazy, Suspense } from "react";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import { TStatus, IMaturityLevel } from "@types";
import getStatusText from "@utils/getStatusText";
import hasStatus from "@utils/hasStatus";
import { Trans } from "react-i18next";
import { styles, getMaturityLevelColors } from "@styles";
import SkeletonGauge from "@common/charts/SkeletonGauge";
import ConfidenceLevel from "@/utils/confidenceLevel/confidenceLevel";
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
  display_confidence_component?: boolean;
  isMobileScreen?: boolean;
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
    isMobileScreen,
    display_confidence_component,
    ...rest
  } = props;
  const colorPallet = getMaturityLevelColors(maturity_level_number);
  const colorCode = colorPallet[level_value - 1];
  const GaugeComponent = lazy(
    () => import(`./GaugeComponent${maturity_level_number}.tsx`)
  );
  const confidenceValue = confidence_value ? confidence_value : 0;
  const calculateFontSize = (length: number): string => {
    const maxLength = 14; // Example threshold for maximum length
    const minLength = 8; // Example threshold for minimum length
    let maxFontSizeRem = 1.5; // 24px / 16 = 1.5rem
    let minFontSizeRem = 1.125; // 18px / 16 = 1.125rem
    if (isMobileScreen) {
      maxFontSizeRem = 1.5;
      minFontSizeRem = 1.25;
    }
    if (shortTitle && !isMobileScreen) {
      maxFontSizeRem = 3;
      minFontSizeRem = 2.5;
    }

    if (length <= minLength) return `${maxFontSizeRem}rem`;
    if (length >= maxLength) return `${minFontSizeRem}rem`;

    const fontSizeRem =
      maxFontSizeRem -
      ((length - minLength) / (maxLength - minLength)) *
        (maxFontSizeRem - minFontSizeRem);
    return `${fontSizeRem}rem`;
  };
  const fontSize = calculateFontSize(maturity_level_status?.length);
  return (
    <Box p={1} position="relative" width="100%" {...rest}>
      <Suspense fallback={<SkeletonGauge />}>
        <GaugeComponent
          confidence_value={confidence_value}
          show_confidence={show_confidence}
          colorCode={colorCode}
          value={!!level_value ? level_value : -1}
          height={height}
          className={className}
        />
      </Suspense>
      {!!level_value ? (
        <Box
          sx={{
            ...styles.centerCVH,
            bottom: `${display_confidence_component ? "22%" : "40%"}`,
            left: "25%",
            right: "25%",
            textAlign: "center",
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
            fontSize={fontSize}
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
                i18nKey="gaugeConfidence"
                values={{
                  percent: Math.ceil(confidenceValue),
                }}
              />
            </Typography>
          )}
          {display_confidence_component && (
            <Tooltip
              title={
                <Trans
                  i18nKey="withPercentConfidence"
                  values={{
                    percent: Math.ceil(confidenceValue),
                  }}
                />
              }
            >
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography
                  variant="subtitle2"
                  color="rgba(157, 167, 179, 1)"
                  mt={1}
                  fontSize={16}
                  justifyContent="center"
                  alignItems="center"
                  display="flex"
                >
                  {" "}
                  <ConfidenceLevel
                    displayNumber
                    inputNumber={Math.ceil(confidenceValue)}
                  ></ConfidenceLevel>
                </Typography>
              </Box>
            </Tooltip>
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
