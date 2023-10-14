import { Box, BoxProps } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { styles } from "@styles";
interface IGettingThingsReadyLoadingProps extends BoxProps {}

const ErrorRecalculating = (props: IGettingThingsReadyLoadingProps) => {
  const { ...rest } = props;
  return (
    <Box
      color="gray"
      {...rest}
      sx={{
        width: "100%",
        minWidth: { xs: "120px", sm: "360px" },
        maxWidth: "400px",
        px: { xs: 0.5, sm: 2 },
        margin:"0 auto",
        ...(rest.sx || {}),
      }}
    >
      <Box sx={{...styles.centerCH}}>
        <Typography variant="h5">
          <Trans i18nKey="insightsAreRecalculating" />
        </Typography>
        <Typography variant="h5">
          <Trans i18nKey="pleaseWait" />
        </Typography>
      </Box>
      <LinearProgress color="inherit" sx={{ marginTop: "12px" }} />
    </Box>
  );
};

export default ErrorRecalculating;
