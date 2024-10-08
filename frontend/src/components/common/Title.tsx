import Typography, { TypographyProps } from "@mui/material/Typography";
import { Link as RLink, To } from "react-router-dom";
import Link from "@mui/material/Link";
import Box, { BoxProps } from "@mui/material/Box";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { SvgIconProps } from "@mui/material/SvgIcon";
import AnchorRoundedIcon from "@mui/icons-material/AnchorRounded";
import { styles } from "@styles";
import { GoHome } from "react-icons/go";
import { theme } from "@/config/theme";
interface ITitle extends Omit<TypographyProps, "borderBottom"> {
  sup?: JSX.Element | string;
  sub?: JSX.Element | string;
  borderBottom?: string | boolean;
  toolbar?: JSX.Element;
  backLink?: To | -1;
  backIconProps?: SvgIconProps;
  size?: "small" | "medium" | "large";
  wrapperProps?: BoxProps;
  toolbarProps?: BoxProps;
  inPageLink?: string;
  avatar?: JSX.Element;
  titleProps?: TypographyProps;
  subProps?: TypographyProps;
}

const Title = (props: ITitle) => {
  const {
    sup,
    children,
    sub,
    borderBottom,
    toolbar,
    size = "medium",
    backLink,
    backIconProps = {},
    wrapperProps = {},
    toolbarProps = {},
    titleProps = {},
    subProps = {},
    inPageLink,
    avatar,
    ...rest
  } = props;

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-end"
      sx={{
        paddingBottom: "2px",
        "&:hover a.title-hash-link": { opacity: 1 },
        borderBottom:
          typeof borderBottom === "boolean" && borderBottom
            ? (theme) => `1px solid ${theme.palette.grey[300]}`
            : (borderBottom as string),
        ...(rest.sx || {}),
        ...wrapperProps,
      }}
      {...wrapperProps}
    >
      {avatar && (
        <Box sx={{ ...styles.centerV, alignSelf: "center" }}>{avatar}</Box>
      )}
      <Box sx={{ flex: 1 }} {...rest}>
        {backLink ? (
          <Box display="flex" justifyContent={"flex-start"}>
            <Box
              minWidth="40px"
              sx={{
                ...styles.centerV,
                textDecoration: "none",
                ml: sup ? { xs: 0, md: 0 } : "-4px",
              }}
            >
              <Box
                component={RLink}
                to={backLink as To}
                display="flex"
                sx={{ textDecoration: "none", color: "inherit" }}
              >
                {backLink === "/" ? (
                  <GoHome fontSize="22px" color="#9DA7B3" {...backIconProps} />
                ) : (
                  <ArrowBackRoundedIcon
                    fontSize="small"
                    color="inherit"
                    sx={{
                      opacity: 0.85,
                      color: "gray",
                      marginRight: theme.direction === "ltr" ? 0.5 : "unset",
                      marginLeft: theme.direction === "rtl" ? 0.5 : "unset",
                    }}
                    {...backIconProps}
                  />
                )}
                <span style={{ marginInline: "8px" }}>/</span>
              </Box>
              {sup && (
                <Typography
                  textTransform="uppercase"
                  variant={
                    size === "small"
                      ? "subSmall"
                      : size === "large"
                        ? "subLarge"
                        : "subMedium"
                  }
                  lineHeight={0}
                >
                  {sup}
                </Typography>
              )}
            </Box>
          </Box>
        ) : sup ? (
          <Typography
            textTransform="uppercase"
            variant={
              size === "small"
                ? "subSmall"
                : size === "large"
                  ? "subLarge"
                  : "subMedium"
            }
            {...subProps}
          >
            {sup}
          </Typography>
        ) : (
          <></>
        )}
        <Typography
          textTransform={size === "large" ? "inherit" : "uppercase"}
          fontWeight="Bold"
          variant={
            size === "small" ? "h6" : size === "large" ? "headlineLarge" : "h5"
          }
          color={size === "large" ? "#2466A8" : "inherit"}
          {...titleProps}
          sx={{
            ...styles.centerV,
            display: { xs: "block", sm: "flex" },
            ...((titleProps?.sx || {}) as any),
          }}
        >
          {children}
          {inPageLink && (
            <Link
              href={`#${inPageLink}`}
              className="title-hash-link"
              sx={{
                display: "flex",
                opacity: 0,
                alignItems: "center",
                ml: 1,
                transition: "opacity .1s ease",
                position: "relative",
              }}
            >
              <AnchorRoundedIcon fontSize="small" />
              <Box id={inPageLink} position="absolute" top="-84px" />
            </Link>
          )}
        </Typography>
        {sub && (
          <Typography
            variant={
              size === "small"
                ? "subSmall"
                : size === "large"
                  ? "subLarge"
                  : "subMedium"
            }
          >
            {sub}
          </Typography>
        )}
      </Box>
      <Box
        ml={theme.direction === "rtl" ? "unset" : "auto"}
        mr={theme.direction !== "rtl" ? "unset" : "auto"}
        {...toolbarProps}
      >
        {toolbar}
      </Box>
    </Box>
  );
};

export default Title;
