import { Box, Typography, BoxProps } from "@mui/material";
import { lazy, Suspense } from "react";
import GettingThingsReadyLoading from "@common/loadings/GettingThingsReadyLoading";
import { TStatus, IMaturityLevel } from "@types";
import getStatusText from "@utils/getStatusText";
import hasStatus from "@utils/hasStatus";
import { Trans } from "react-i18next";
import { styles, getMaturityLevelColors } from "@styles";
import React from "react";
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
  const GaugeComponent2 = React.lazy(
    () => import("@/components/common/charts/GaugeComponent2")
  );
  const GaugeComponent3 = React.lazy(
    () => import("@/components/common/charts/GaugeComponent3")
  );
  const GaugeComponent4 = React.lazy(
    () => import("@/components/common/charts/GaugeComponent4")
  );
  const GaugeComponent5 = React.lazy(
    () => import("@/components/common/charts/GaugeComponent5")
  );
  const GaugeComponent6 = React.lazy(
    () => import("@/components/common/charts/GaugeComponent6")
  );
  const GaugeComponent7 = React.lazy(
    () => import("@/components/common/charts/GaugeComponent7")
  );
  const GaugeComponent8 = React.lazy(
    () => import("@/components/common/charts/GaugeComponent8")
  );
  const GaugeComponent9 = React.lazy(
    () => import("@/components/common/charts/GaugeComponent9")
  );
  const GaugeComponent10 = React.lazy(
    () => import("@/components/common/charts/GaugeComponent10")
  );
  let ComponentToRender;
  switch (maturity_level_number) {
    case 2:
      level_value !== null && level_value !== undefined
        ? (ComponentToRender = (
            <GaugeComponent2 colorCode={colorCode} value={level_value} />
          ))
        : (ComponentToRender = (
            <GaugeComponent2 colorCode={colorCode} value={-1} />
          ));
      break;
    case 3:
      level_value !== null && level_value !== undefined
        ? (ComponentToRender = (
            <GaugeComponent3 colorCode={colorCode} value={level_value} />
          ))
        : (ComponentToRender = (
            <GaugeComponent3 colorCode={colorCode} value={-1} />
          ));
      break;
    case 4:
      level_value !== null && level_value !== undefined
        ? (ComponentToRender = (
            <GaugeComponent4 colorCode={colorCode} value={level_value} />
          ))
        : (ComponentToRender = (
            <GaugeComponent4 colorCode={colorCode} value={-1} />
          ));
      break;
    case 5:
      level_value !== null && level_value !== undefined
        ? (ComponentToRender = (
            <GaugeComponent5 colorCode={colorCode} value={level_value} />
          ))
        : (ComponentToRender = (
            <GaugeComponent5 colorCode={colorCode} value={-1} />
          ));
      break;
    case 6:
      level_value !== null && level_value !== undefined
        ? (ComponentToRender = (
            <GaugeComponent6 colorCode={colorCode} value={level_value} />
          ))
        : (ComponentToRender = (
            <GaugeComponent6 colorCode={colorCode} value={-1} />
          ));
      break;
    case 7:
      level_value !== null && level_value !== undefined
        ? (ComponentToRender = (
            <GaugeComponent7 colorCode={colorCode} value={level_value} />
          ))
        : (ComponentToRender = (
            <GaugeComponent7 colorCode={colorCode} value={-1} />
          ));
      break;
    case 8:
      level_value !== null && level_value !== undefined
        ? (ComponentToRender = (
            <GaugeComponent8 colorCode={colorCode} value={level_value} />
          ))
        : (ComponentToRender = (
            <GaugeComponent8 colorCode={colorCode} value={-1} />
          ));
      break;
    case 9:
      level_value !== null && level_value !== undefined
        ? (ComponentToRender = (
            <GaugeComponent9 colorCode={colorCode} value={level_value} />
          ))
        : (ComponentToRender = (
            <GaugeComponent9 colorCode={colorCode} value={-1} />
          ));
      break;
    case 10:
      level_value !== null && level_value !== undefined
        ? (ComponentToRender = (
            <GaugeComponent10 colorCode={colorCode} value={level_value} />
          ))
        : (ComponentToRender = (
            <GaugeComponent10 colorCode={colorCode} value={-1} />
          ));
      break;
  }

  return (
    <Box p={1} position="relative" width="100%" {...rest}>
      {/* <img
        width="100%"
        src={`/assets/svg/ml_${maturity_level_number}.svg`}
        alt={getStatusText(systemStatus, true) as string}
      /> */}

      <Suspense fallback={<GettingThingsReadyLoading />}>
        {ComponentToRender}
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
