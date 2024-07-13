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
import { getNumberBaseOnScreen } from "@/utils/returnBasedOnScreen";

export const customFontFamily =
  '"Roboto","Helvetica","Arial","sans-serif","Vazirmatn"';
export const customHeaderFamily = "Oswald, Roboto, Vazirmatn";
const fontSize = ["12px", "14px", "14px", "16px", "16px"];
export const primaryFontFamily = "Ubuntu";
export const secondaryFontFamily = "Sansation";

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
    headlineSmall: React.CSSProperties;
    headlineMedium: React.CSSProperties;
    headlineLarge: React.CSSProperties;
    displaySmall: React.CSSProperties;
    displayMedium: React.CSSProperties;
    displayLarge: React.CSSProperties;
    titleSmall: React.CSSProperties;
    titleMedium: React.CSSProperties;
    titleLarge: React.CSSProperties;
    bodySmall: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    labelSmall: React.CSSProperties;
    labelMedium: React.CSSProperties;
    labelLarge: React.CSSProperties;
    subSmall: React.CSSProperties;
    subMedium: React.CSSProperties;
    subLarge: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    headlineSmall?: React.CSSProperties;
    headlineMedium?: React.CSSProperties;
    headlineLarge?: React.CSSProperties;
    displaySmall?: React.CSSProperties;
    displayMedium?: React.CSSProperties;
    displayLarge?: React.CSSProperties;
    titleSmall?: React.CSSProperties;
    titleMedium?: React.CSSProperties;
    titleLarge?: React.CSSProperties;
    bodySmall?: React.CSSProperties;
    bodyMedium?: React.CSSProperties;
    bodyLarge?: React.CSSProperties;
    labelSmall?: React.CSSProperties;
    labelMedium?: React.CSSProperties;
    labelLarge?: React.CSSProperties;
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
    headlineSmall?: true;
    headlineMedium?: true;
    headlineLarge?: true;
    displaySmall?: true;
    displayMedium?: true;
    displayLarge?: true;
    titleSmall?: true;
    titleMedium?: true;
    titleLarge?: true;
    bodySmall?: true;
    bodyMedium?: true;
    bodyLarge?: true;
    labelSmall?: true;
    labelMedium?: true;
    labelLarge?: true;
    subSmall?: true;
    subMedium?: true;
    subLarge?: true;
  }
}

const palette = createPalette({
  background: { secondary: "#273248", secondaryDark: "#121d33" },
  ml: { primary: "#6035A1" },
  cl: { primary: "#3596A1" },
  error: { main: "#D81E5B", contrastText: "#fff" },
  warning: { main: "#F9A03F", contrastText: "#fff" },
});

export const theme = createTheme({
  palette,
  typography: {
    fontFamily: customFontFamily,
    subSmall: {
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: "0.09em",
      textTransform: "none",
      color: "GrayText",
    },
    subMedium: {
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: "0.09em",
      color: "GrayText",
    },
    subLarge: {
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: "0.09em",
      color: "GrayText",
    },
    headlineSmall: {
      fontFamily: primaryFontFamily,
      fontWeight: 500,
      fontSize: "1.5rem",
      lineHeight: "2rem",
      letterSpacing: "-3%",
    },
    headlineMedium: {
      fontFamily: primaryFontFamily,
      fontWeight: "bold",
      fontSize: "2rem",
      lineHeight: "2.25rem",
      letterSpacing: "0",
    },
    headlineLarge: {
      fontFamily: primaryFontFamily,
      fontWeight: "bold",
      fontSize: "3.5rem",
      lineHeight: "3.7rem",
      letterSpacing: "0",
    },
    displaySmall: {
      fontFamily: secondaryFontFamily,
      fontSize: "1.5rem",
      fontWeight: "lighter",
      lineHeight: "2rem",
      letterSpacing: "0",
    },
    displayMedium: {
      fontFamily: customFontFamily,
      fontSize: "1.75rem",
      fontWeight: "lighter",
      lineHeight: "2.25rem",
      letterSpacing: "0",
    },
    displayLarge: {
      fontFamily: secondaryFontFamily,
      fontSize: "4rem",
      fontWeight: "bold",
      lineHeight: "5.75rem",
      letterSpacing: "0",
    },
    titleSmall: {
      fontFamily: primaryFontFamily,
      fontWeight: 600,
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      letterSpacing: ".1px",
    },
    titleMedium: {
      fontFamily: primaryFontFamily,
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: "1.5rem",
      letterSpacing: ".15px",
    },
    titleLarge: {
      fontFamily: primaryFontFamily,
      fontWeight: 500,
      fontSize: "1.375rem",
      lineHeight: "1.75rem",
      letterSpacing: "0",
    },
    bodySmall: {
      fontFamily: primaryFontFamily,
      fontWeight: "normal",
      fontSize: "0.75rem",
      lineHeight: "1rem",
      letterSpacing: "0.4px",
    },
    bodyMedium: {
      fontFamily: primaryFontFamily,
      fontWeight: 200,
      fontSize: "0.875rem",
      lineHeight: "1.125rem",
      letterSpacing: "0.25px",
    },
    bodyLarge: {
      fontFamily: primaryFontFamily,
      fontWeight: "lighter",
      fontSize: "1rem",
      lineHeight: "1.5rem",
      letterSpacing: "0.5px",
    },
    labelSmall: {
      fontFamily: primaryFontFamily,
      fontWeight: "lighter",
      fontSize: "0.6875rem",
      lineHeight: "0.75rem",
      letterSpacing: "0.5px",
    },
    labelMedium: {
      fontFamily: primaryFontFamily,
      fontWeight: 500,
      fontSize: "0.75rem",
      lineHeight: "1rem",
      letterSpacing: "0.5px",
    },
    labelLarge: {
      fontFamily: primaryFontFamily,
      fontWeight: "bold",
      fontSize: "0.875rem",
      lineHeight: "1.125rem",
      letterSpacing: "0.1px",
    },
    button: {
      fontFamily: customHeaderFamily,
      letterSpacing: ".1em",
    },
    h3: {
      fontFamily: customHeaderFamily,
    },
    h4: {
      fontFamily: customHeaderFamily,
      opacity: 0.9,
    },
    h5: {
      fontFamily: customHeaderFamily,
      opacity: 0.85,
    },
    h6: {
      fontFamily: customHeaderFamily,
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
          font-size: ${fontSize[4]};
        }
        @media (max-width: 1600px) {
          html {
            font-size: ${fontSize[3]};
          }
        }
        @media (max-width: 1280px) {
          html {
            font-size: ${fontSize[2]};
          }
        }
        @media (max-width: 960px) {
          html {
            font-size: ${fontSize[1]};
          }
        }
        @media (max-width: 600px) {
          html {
            font-size: ${fontSize[0]};
          }
        }
        body {
          background: #EDEFF1;
        }
      `,
    },
    MuiButtonGroup: {
      defaultProps: {
        color: "primary",
      },
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
