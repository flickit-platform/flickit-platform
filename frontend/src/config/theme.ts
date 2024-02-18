import createPalette from "@mui/material/styles/createPalette";
import { createTheme } from "@mui/material";
import "@fontsource/oswald/300.css";
import "@fontsource/oswald/400.css";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/700.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

declare module "@mui/material/styles/createPalette" {
  interface TypeBackground {
    secondary: string;
    secondaryDark: string;
  }
  interface PaletteOptions {
    ml: { primary: React.CSSProperties["color"] };
    cl: { primary: React.CSSProperties["color"] };
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

  interface Palette {
    ml: { primary: React.CSSProperties["color"] };
    cl: { primary: React.CSSProperties["color"] };
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
  ml: { primary: "#6035A1" },
  cl: { primary: "#3596A1" },
});
const is_farsi = localStorage.getItem("lang") === "fa" ? true : false;
export const theme = createTheme({
  palette,
  typography: {
    subSmall: {
      fontFamily: is_farsi
        ? "'Vazirmatn','Arial','sans-serif'"
        : "'Helvetica','Roboto','Arial','sans-serif'",
      fontWeight: 500,
      fontSize: "0.665rem",
      lineHeight: 1.57,
      letterSpacing: "0.09em",
      textTransform: "none",
      color: "GrayText",
    },
    subMedium: {
      fontFamily: is_farsi
        ? "'Vazirmatn','Arial','sans-serif'"
        : "'Helvetica','Roboto','Arial','sans-serif'",
      fontWeight: 500,
      fontSize: "0.75rem",
      lineHeight: 1.57,
      letterSpacing: "0.09em",
      color: "GrayText",
    },
    subLarge: {
      fontFamily: is_farsi
        ? "'Vazirmatn','Arial','sans-serif'"
        : "'Helvetica','Roboto','Arial','sans-serif'",

      fontWeight: 500,
      fontSize: "0.8rem",
      lineHeight: 1.57,
      letterSpacing: "0.09em",
      color: "GrayText",
    },
    button: {
      fontFamily: is_farsi ? "'Vazirmatn'" : "'Oswald','Roboto'",
      letterSpacing: is_farsi ? "0" : ".1em",
    },
    h3: {
      fontFamily: is_farsi ? "'Vazirmatn'" : "'Oswald','Roboto'",
    },
    h4: {
      fontFamily: is_farsi ? "'Vazirmatn'" : "'Oswald','Roboto'",
      opacity: 0.9,
    },
    h5: {
      fontFamily: is_farsi ? "'Vazirmatn'" : "'Oswald','Roboto'",
      opacity: 0.85,
    },
    h6: {
      fontFamily: is_farsi ? "'Vazirmatn'" : "'Oswald','Roboto'",
      letterSpacing: is_farsi ? "0" : "0.05em",
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
        body {
          background: #f5f5f5;
          direction:${is_farsi ? "rtl" : "ltr"};
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
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: "0px",
          overflow: "auto",
          padding: "0px 8px",
          borderBottom: "1px solid #d3d3d3",
        },
        indicator: {
          backgroundColor: palette.secondary.main,
          borderRadius: 1,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: "4px 8px",
          margin: "0px 4px",
          borderRadius: "5px",
          minHeight: "40px",
          transition: "background-color .1s ease, color .1s ease",
          "&:hover": {
            backgroundColor: "#e1dede",
          },
          "&.Mui-selected": {
            color: palette.secondary.main,
          },
        },
      },
    },

    //@ts-expect-error
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: "4px 2px",
        },
      },
    },
  },
});
