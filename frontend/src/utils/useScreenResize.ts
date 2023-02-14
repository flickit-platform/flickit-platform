import { Breakpoint, useMediaQuery, useTheme } from "@mui/material";

/**
 *
 * returns true when the screen size meets the breakpoint size
 */
const useScreenResize = (key: number | Breakpoint) => {
  const theme = useTheme();
  const mediaQuery = useMediaQuery(theme.breakpoints.down(key));
  return mediaQuery;
};

export default useScreenResize;
