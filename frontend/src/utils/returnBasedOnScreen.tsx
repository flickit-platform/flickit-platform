import React, { useRef, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { Trans } from "react-i18next";
import Paper from "@mui/material/Paper";
import { ESystemStatus, ISubjectInfo, TStatus, IMaturityLevel } from "@types";

export const getNumberBaseOnScreen = (
  xs: number,
  sm: number,
  md: number,
  lg: number,
  xl: number
): number => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLg = useMediaQuery(theme.breakpoints.only("lg"));
  const isXl = useMediaQuery(theme.breakpoints.only("xl"));

  if (isXs) return xs;
  if (isSm) return sm;
  if (isMd) return md;
  if (isLg) return lg;
  if (isXl) return xl;
  return md;
};
