import { Box, BoxProps } from "@mui/material";
import { TStatus } from "@types";
import getStatusText from "@utils/getStatusText";
import hasStatus from "@utils/hasStatus";

interface IGaugeProps extends BoxProps {
  systemStatus: TStatus;
  name?: string;
}

const Gauge = (props: IGaugeProps) => {
  const { systemStatus, name = "This system", ...rest } = props;
  console.log(systemStatus)
  const hasStat = hasStatus(systemStatus);
  return (
    <Box p={1} position="relative" width="100%" {...rest}>
      <img
        width="100%"
        src={`/assets/svg/${hasStat ? systemStatus : "noStatus"}.svg`}
        alt={getStatusText(systemStatus, true) as string}
      />
    </Box>
  );
};

export { Gauge };
