import { keyframes, SxProps, Theme } from "@mui/material";
import { TStatus } from "../types";
import hasStatus from "../utils/hasStatus";

const style = (style: SxProps<Theme>): SxProps<Theme> => style;

const commonStyles = {
  centerVH: style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),
  centerV: style({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  }),
  centerH: style({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  }),
  centerCVH: style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  }),
  centerCV: style({
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  }),
  centerCH: style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }),
  formGrid: style({
    marginTop: (theme) => `${theme.spacing(2)}`,
  }),
  activeNavbarLink: style({
    "&.active": {
      color: (theme) => theme.palette.primary.dark,
    },
  }),
};

const cards = {
  auth: style({
    ...commonStyles.centerCH,
    px: { xs: 2, sm: 4 },
    py: { xs: 3, sm: 4 },
    flex: 1,
    m: 1,
    maxWidth: "460px",
  }),
};

const auth = {
  authLayout: style({
    background: (theme) =>
      `radial-gradient(${theme.palette.background.secondary},${theme.palette.background.secondaryDark})`,
    minHeight: "100vh",
    ...commonStyles.centerCH,
  }),
};

const buttons = {
  compareButton: style({
    position: { xs: "fixed", md: "absolute" },
    borderRadius: { xs: 0, sm: "100%" },
    transform: {
      xs: "translate(0,0)",
      md: "translate(50%,calc(50% + 24px))",
    },
    right: { xs: 0, sm: "26px", md: "50%" },
    bottom: { xs: 0, sm: "26px", md: "50%" },
    width: { xs: "100%", sm: "96px" },
    height: { xs: "40px", sm: "96px" },
    zIndex: 2,
  }),
  compareButtonBg: style({
    position: { xs: "fixed", md: "absolute" },
    borderRadius: { xs: 0, sm: "100%" },
    right: { xs: 0, sm: "19px", md: "50%" },
    bottom: { xs: 0, sm: "19px", md: "50%" },
    background: "white",
    transform: {
      xs: "translate(0,0)",
      md: "translate(50%,calc(50% + 24px))",
    },
    width: { xs: "100%", sm: "110px" },
    height: { xs: "46px", sm: "110px" },
    zIndex: 1,
  }),
};

export const styles = {
  ...commonStyles,
  ...auth,
  ...buttons,
  cards,
};

export const statusColorMap: Record<NonNullable<TStatus>, string> = {
  WEAK: "#bb0000",
  RISKY: "#e9730d",
  NORMAL: "#e5da10",
  GOOD: "#45a53a",
  OPTIMIZED: "#107e3e",
  "Not Calculated": "#b7b7b7",
};

export const getColorOfStatus = (
  status: TStatus,
  fallBackColor: string = "#b7b7b7"
) => {
  if (hasStatus(status)) {
    return statusColorMap[status as NonNullable<TStatus>];
  }
  return fallBackColor;
};

const pomp = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;
const noPomp = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
`;

export const animations = {
  pomp,
  noPomp,
};
