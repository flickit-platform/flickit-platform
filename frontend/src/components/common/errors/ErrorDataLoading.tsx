import Box, { BoxProps } from "@mui/material/Box";
import ReportGmailerrorredRoundedIcon from "@mui/icons-material/ReportGmailerrorredRounded";
import { Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { styles } from "@styles";

interface IErrorDataLoadingProps extends BoxProps {}

const ErrorDataLoading = (props: IErrorDataLoadingProps) => {
  const { ...rest } = props;
  return (
    <Box sx={{ ...styles.centerCVH }} pt="64px" pb="44px" {...rest}>
      <ReportGmailerrorredRoundedIcon sx={{ fontSize: "4rem", mb: "16px" }} />
      <Typography>
        <Trans i18nKey="someThingWentWrong" />
      </Typography>
    </Box>
  );
};

export default ErrorDataLoading;
