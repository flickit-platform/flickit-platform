import { keyframes, SxProps, Theme } from "@mui/material";
import { TStatus } from "@types";
import hasStatus from "@utils/hasStatus";

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
  circularProgressBackgroundStroke: style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [`& .MuiCircularProgress-circle`]: {
      strokeLinecap: "round",
    },
    boxShadow: "0 0 4px #bbb7b7 inset",
    borderRadius: "100%",
  }),
  ellipsis: style({
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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

const compare = {
  compareResultBorder: style({
    "&:not(:last-of-type) > div": {
      borderRight: {md:"1px solid #e7e7e7",sm:"transparent"},
      borderBottom: {md:"transparent",sm:"",xs:"1px solid #e7e7e7"},
    },
  }),
};

export const styles = {
  ...commonStyles,
  ...auth,
  ...buttons,
  ...compare,
  cards,
};

export const statusColorMap: Record<NonNullable<TStatus>, string> = {
  WEAK: "#da7930",
  RISKY: "#da7930",
  NORMAL: "#faee56",
  GOOD: "#60a349",
  OPTIMIZED: "#107e3e",
  ELEMENTARY: "#ab2317",
  MODERATE: "#faee56",
  GREAT: "#ceb04e",

  "Not Calculated": "#b7b7b7",
};

export const maturityLevelColorMap: any = {
  ML2: ["#822123", "#347444"],
  ML3: ["#822123", "#BE5923", "#347444"],
  ML4: ["#822123", "#BE5923", "#F4B949", "#347444"],
  ML5: ["#862123", "#BE5823", "#F4B942", "#9BB763", "#347444"],
  ML6: ["#822123", "#BE5823", "#F4B942", "#347444", "#353F4E", "#D4AF37"],
  ML7: [
    "#822123",
    "#B32E30",
    "#BE5823",
    "#F4B942",
    "#347444",
    "#353F4E",
    "#D4AF37",
  ],
  ML8: [
    "#822123",
    "#B32E30",
    "#BE5823",
    "#E7A039",
    "#F4B942",
    "#347444",
    "#353F4E",
    "#D4AF37",
  ],
  ML9: [
    "#822123",
    "#B32E30",
    "#BE5823",
    "#E7A039",
    "#F4B942",
    "#9BB763",
    "#347444",
    "#353F4E",
    "#D4AF37",
  ],
  ML10: [
    "#822123",
    "#B32E30",
    "#BE5823",
    "#E7A039",
    "#F4B942",
    "#9BB763",
    "#347444",
    "#2F6683",
    "#353F4E",
    "#D4AF37",
  ],
};
export const getMaturityLevelColors = (maturity_level_number: number) => {
  switch (maturity_level_number) {
    case 2:
      return maturityLevelColorMap.ML2;
    case 3:
      return maturityLevelColorMap.ML3;
    case 4:
      return maturityLevelColorMap.ML4;
    case 5:
      return maturityLevelColorMap.ML5;
    case 6:
      return maturityLevelColorMap.ML6;
    case 7:
      return maturityLevelColorMap.ML7;
    case 8:
      return maturityLevelColorMap.ML8;
    case 9:
      return maturityLevelColorMap.ML9;
    case 10:
      return maturityLevelColorMap.ML10;
  }
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
