import { Breakpoint, useMediaQuery, useTheme } from "@mui/material";
import React from "react";

const useScreenResize = (key: number | Breakpoint) => {
  const theme = useTheme();
  const mediaQuery = useMediaQuery(theme.breakpoints.down(key));
  return mediaQuery;
};

export default useScreenResize;
