import React from "react";
import Box from "@mui/material/Box";
import { styles } from "../../../config/styles";
import ErrorNotFoundOrAccessDeniedImage from "../../../assets/svg/404-withmsg.svg";

export const ErrorNotFoundOrAccessDenied = () => {
  return (
    <Box
      sx={{ ...styles.centerCVH }}
      textAlign="center"
      height="calc(100vh - 264px)"
    >
      <Box sx={{ width: { xs: "100vw", md: "70vw", lg: "60vw" } }}>
        <img
          src={ErrorNotFoundOrAccessDeniedImage}
          alt={"not found or access denied"}
          width="100%"
        />
      </Box>
    </Box>
  );
};
