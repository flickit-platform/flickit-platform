import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { styles } from "../../config/styles";
import PageNotFoundImage from "../../assets/svg/404.svg";

export const PageNotFound = () => {
  return (
    <Box
      sx={{ ...styles.centerCVH }}
      textAlign="center"
      height="calc(100vh - 264px)"
    >
      <Box sx={{ width: { xs: "100vw", sm: "80vw", md: "60vw", lg: "50vw" } }}>
        <img src={PageNotFoundImage} alt={"page not found"} width="100%" />
      </Box>
      {/* <Typography variant="h2" fontFamily="OswaldBold">
        <Trans i18nKey="notFound" />
      </Typography> */}
    </Box>
  );
};
