import React from "react";
import Breadcrumbs, { BreadcrumbsProps } from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { styles } from "../../config/styles";
import Box from "@mui/material/Box";
import { LoadingSkeleton } from "./loadings/LoadingSkeleton";

interface ISupTitleBreadcrumbProps extends BreadcrumbsProps {
  routes: {
    sup?: string;
    title: string | JSX.Element;
    to?: string;
    icon?: JSX.Element;
  }[];
}

const SupTitleBreadcrumb = (props: ISupTitleBreadcrumbProps) => {
  const { routes = [] } = props;
  return (
    <Breadcrumbs>
      {routes.map((route) => {
        const { to, title, sup, icon } = route;
        return to ? (
          <Box display="flex" flexDirection={"column"}>
            {/* {sup && (
              <Typography
                sx={{
                  fontSize: "0.6rem",
                  fontFamily: "RobotoMedium",
                  opacity: 0.6,
                  letterSpacing: "0.07em",
                  color: "text.primary",
                }}
              >
                {sup}
              </Typography>
            )} */}

            <MuiLink
              component={Link}
              underline="hover"
              color="inherit"
              to={to}
              sx={{
                ...styles.centerV,
                fontSize: "0.8rem",
                fontFamily: "RobotoBold",
                opacity: 0.6,
                letterSpacing: "0.085em",
                color: "primary.dark",
              }}
            >
              {icon}
              {title || (
                <LoadingSkeleton width={"70px"} sx={{ borderRadius: 1 }} />
              )}
            </MuiLink>
          </Box>
        ) : (
          <Typography color="text.primary">{title}</Typography>
        );
      })}
      {/* <Typography color="text.primary">Breadcrumbs</Typography> */}
    </Breadcrumbs>
  );
};

export default SupTitleBreadcrumb;
