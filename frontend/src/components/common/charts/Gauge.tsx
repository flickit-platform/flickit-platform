import { Box, Typography, BoxProps, Tooltip } from "@mui/material";
import { lazy, Suspense } from "react";
import { Trans } from "react-i18next";
import { styles, getMaturityLevelColors } from "@styles";
import SkeletonGauge from "@common/charts/SkeletonGauge";
import ConfidenceLevel from "@/utils/confidenceLevel/confidenceLevel";
import PermissionRequired from "@common/charts/permissionRequired";
import { primaryFontFamily } from "@/config/theme";
interface IGaugeProps extends BoxProps {
  maturity_level_number: number;
  maturity_level_status: string;
  level_value: number;
  confidence_value?: number | null;
  height?: number;
  className?: string;
  hideGuidance?: boolean;
  confidence_text?: string | null;
  isMobileScreen?: boolean;
  maturity_status_guide?: string | null;
  maturity_status_guide_variant?: any;
}

const Gauge = (props: IGaugeProps) => {
  const {
    maturity_level_status,
    maturity_level_number = 5,
    level_value,
    confidence_value,
    height = 200,
    className,
    hideGuidance,
    isMobileScreen,
    confidence_text,
    maturity_status_guide,
    maturity_status_guide_variant = "titleMedium",
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
    let minFontSizeRem = 1; // 18px / 16 = 1.125rem
    if (isMobileScreen) {
      maxFontSizeRem = 1.35;
      minFontSizeRem = 1.125;
    }
    if (hideGuidance && !isMobileScreen) {
      maxFontSizeRem = 3;
      minFontSizeRem = 2.25;
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
        {maturity_level_status ? (
          <GaugeComponent
            confidence_value={confidence_value}
            colorCode={colorCode}
            value={!!level_value ? level_value : -1}
            height={height}
            className={className}
          />
        ) : (
          <img
            width={"100%"}
            height={height}
            src={"/assets/svg/maturityNull.svg"}
          />
        )}
      </Suspense>
      {!!level_value ? (
        <Box
          sx={{
            ...styles.centerCVH,
            bottom: hideGuidance ? `24%` : "40%",
            left: isMobileScreen ? "26%" : "20%",
            right: isMobileScreen ? "26%" : "20%",
            textAlign: "center",
          }}
          position="absolute"
        >
          {!hideGuidance && (
            <Typography
              variant="subtitle2"
              color="black"
              fontSize={{ xs: "1.35rem", sm: "1.35rem", md: "0.875rem" }}
            >
              <Trans i18nKey="thisSystemIsIn" />
            </Typography>
          )}
          {confidence_text && (
            <Typography
              variant={
                maturity_status_guide_variant
                  ? maturity_status_guide_variant
                  : "titleMedium"
              }
              color="#243342"
              mt="0.5rem"
              justifyContent="center"
              alignItems="center"
              display="flex"
              gap="0.125rem"
            >
              {confidence_text}
              <ConfidenceLevel
                displayNumber
                inputNumber={Math.ceil(confidenceValue)}
                variant="titleMedium"
              ></ConfidenceLevel>
            </Typography>
          )}
          {maturity_status_guide && (
            <Typography
              mt="1rem"
              variant={maturity_status_guide_variant}
              color="#243342"
            >
              {maturity_status_guide}
            </Typography>
          )}
          <Typography
            sx={{ fontWeight: "bold", fontFamily: primaryFontFamily }}
            variant="h6"
            color={colorCode}
            fontSize={fontSize}
            mt={maturity_status_guide ? "0.5rem" : 0}
            mb={maturity_status_guide ? "-0.5rem" : 0}
          >
            {maturity_level_status}
          </Typography>
          {!hideGuidance && (
            <Typography
              variant="subtitle2"
              color="black"
              fontSize={{ xs: "1.35rem", sm: "1.35rem", md: "0.875rem" }}
            >
              <Trans i18nKey="shape" />
            </Typography>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            ...styles.centerCVH,
            bottom: "22%",
            left: "25%",
            right: "25%",
          }}
          position="absolute"
        >
          <PermissionRequired />
          <Typography
            sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
            variant="h5"
            color="GrayText"
          >
            <Trans i18nKey="permissionRequired" />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export { Gauge };
