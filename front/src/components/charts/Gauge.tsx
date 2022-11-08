import { Typography } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import React from "react";
import { Trans } from "react-i18next";
import { ESystemStatus } from "../../types";

interface IGaugeProps extends BoxProps {
  systemStatus: ESystemStatus;
  name?: string;
}

const statusColorMap = {
  [ESystemStatus.OPTIMIZED]: "#107e3e",
  [ESystemStatus.GOOD]: "#45a53a",
  [ESystemStatus.NORMAL]: "#e5da10",
  [ESystemStatus.RISKY]: "#e9730d",
  [ESystemStatus.WEAK]: "#bb0000",
};

const Gauge = (props: IGaugeProps) => {
  const { systemStatus, name = "This system", ...rest } = props;
  const noStatus =
    !systemStatus || (systemStatus as string) === "Not Calculated";
  return (
    <Box p={1} position="relative" width="100%" {...rest}>
      <img
        src={`/assets/svg/${noStatus ? "noStatus" : systemStatus}.svg`}
        alt={systemStatus}
      />
      {/* <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "60%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "GrayText",
        }}
      >
        <Typography>
          {name} <Trans i18nKey="isIn" />
        </Typography>
        <Typography
          variant="h5"
          fontWeight={"bold"}
          color={statusColorMap[systemStatus]}
        >
          {systemStatus}
        </Typography>
        <Typography>
          <Trans i18nKey="shape" />
        </Typography>
      </Box> */}
    </Box>
  );
};

export { Gauge };
