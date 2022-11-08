import createPalette from "@mui/material/styles/createPalette";
import { createTheme } from "@mui/material/styles";
import RobotoBold from "../assets/fonts/roboto/Roboto-Bold.woff";
import RobotoLight from "../assets/fonts/roboto/Roboto-Light.woff";
import RobotoMedium from "../assets/fonts/roboto/Roboto-Medium.woff";
import RobotoRegular from "../assets/fonts/roboto/Roboto-Regular.woff";
import OswaldBold from "../assets/fonts/oswald/Oswald-Bold.woff";
import OswaldLight from "../assets/fonts/oswald/Oswald-Light.woff";
import OswaldMedium from "../assets/fonts/oswald/Oswald-Medium.woff";
import OswaldRegular from "../assets/fonts/oswald/Oswald-Regular.woff";

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    secondary: string;
    secondaryDark: string;
  }
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    subSmall: React.CSSProperties;
    subMedium: React.CSSProperties;
    subLarge: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    subSmall?: React.CSSProperties;
    subMedium?: React.CSSProperties;
    subLarge?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    subSmall?: true;
    subMedium?: true;
    subLarge?: true;
  }
}

const palette = createPalette({
  background: { secondary: "#273248", secondaryDark: "#121d33" },
});

export const theme = createTheme({
  palette,
  typography: {
    subSmall: {
      fontFamily: '"Roboto","Helvetica","Arial","sans-serif"',
      fontWeight: 500,
      fontSize: "0.665rem",
      lineHeight: 1.57,
      letterSpacing: "0.09em",
      textTransform: "none",
      color: "GrayText",
    },
    subMedium: {
      fontFamily: '"Roboto","Helvetica","Arial","sans-serif"',
      fontWeight: 500,
      fontSize: "0.75rem",
      lineHeight: 1.57,
      letterSpacing: "0.09em",
      color: "GrayText",
    },
    subLarge: {
      fontFamily: '"Roboto","Helvetica","Arial","sans-serif"',
      fontWeight: 500,
      fontSize: "0.8rem",
      lineHeight: 1.57,
      letterSpacing: "0.09em",
      color: "GrayText",
    },
    button: {
      fontFamily: "'OswaldMedium','RobotoMedium'",
      letterSpacing: ".1em",
    },
    h3: {
      fontFamily: "'OswaldBold','RobotoBold'",
    },
    h4: {
      fontFamily: "'OswaldBold','RobotoBold'",
      opacity: 0.9,
    },
    h5: {
      fontFamily: "'OswaldBold','RobotoBold'",
      opacity: 0.85,
    },
    h6: {
      fontFamily: "'OswaldBold','RobotoBold'",
      letterSpacing: "0.05em",
      lineHeight: 1.6,
      opacity: 0.85,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html {
          scroll-behavior: smooth;
        }
        @font-face {
          font-family: 'RobotoRegular';
          font-style: normal;
          font-weight: normal;
          src: local('Roboto-Regular'), url(${RobotoRegular}) format('woff');
        }
        @font-face {
          font-family: 'RobotoBold';
          font-style: normal;
          font-weight: normal;
          src: local('Roboto-Bold'), url(${RobotoBold}) format('woff');
        }
        @font-face {
          font-family: 'RobotoLight';
          font-style: normal;
          font-weight: normal;
          src: local('Roboto-Light'), url(${RobotoLight}) format('woff');
        }
        @font-face {
          font-family: 'RobotoMedium';
          font-style: normal;
          font-weight: normal;
          src: local('Roboto-Medium'), url(${RobotoMedium}) format('woff');
        }
        @font-face {
          font-family: 'OswaldBold';
          font-style: normal;
          font-weight: normal;
          src: local('Oswald-Bold'), url(${OswaldBold}) format('woff');
        }
        @font-face {
          font-family: 'OswaldRegular';
          font-style: normal;
          font-weight: normal;
          src: local('Oswald-Regular'), url(${OswaldRegular}) format('woff');
        }
        @font-face {
          font-family: 'OswaldMedium';
          font-style: normal;
          font-weight: normal;
          src: local('Oswald-Medium'), url(${OswaldMedium}) format('woff');
        }
        @font-face {
          font-family: 'OswaldLight';
          font-style: normal;
          font-weight: normal;
          src: local('Oswald-Light'), url(${OswaldLight}) format('woff');
        }
      `,
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          subSmall: "h6",
          subMedium: "h6",
          subLarge: "h6",
        },
      },
    },
  },
});
