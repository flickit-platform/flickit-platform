import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";

interface IGettingThingsReadyLoadingProps extends BoxProps {}

const GettingThingsReadyLoading = (props: IGettingThingsReadyLoadingProps) => {
  const { ...rest } = props;
  return (
    <Box
      color="white"
      {...rest}
      sx={{
        width: "100%",
        minWidth: { xs: "120px", sm: "360px" },
        maxWidth: "400px",
        px: { xs: 0.5, sm: 2 },
        ...(rest.sx || {}),
      }}
    >
      <Typography variant="h5">
        <Trans i18nKey="gettingThingsReady" />
      </Typography>
      <LinearProgress color="inherit" sx={{ marginTop: "12px" }} />
    </Box>
  );
};

export { GettingThingsReadyLoading };
