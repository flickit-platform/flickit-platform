import Breadcrumbs, { BreadcrumbsProps } from "@mui/material/Breadcrumbs";
import MuiLink from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { styles } from "@styles";
import Box from "@mui/material/Box";
import { LoadingSkeleton } from "./loadings/LoadingSkeleton";
import { TId } from "@types";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";

interface ISupTitleBreadcrumbProps {
  routes: {
    sup?: string;
    to?: string;
    icon?: JSX.Element;
    title: string | JSX.Element;
  }[];
}

const SupTitleBreadcrumb = (props: ISupTitleBreadcrumbProps & BreadcrumbsProps) => {
  const { routes = [], ...rest } = props;
  return (
    <Breadcrumbs {...rest}>
      {routes.map((route, index) => {
        const { to, title, sup, icon } = route;
        const disabled = routes.length - 1 === index || !to;
        return (
          <Box display="flex" flexDirection={"column"} key={index}>
            <MuiLink
              component={disabled ? "p" : Link}
              underline={disabled ? "none" : "hover"}
              color="inherit"
              to={to}
              onClick={(e) => disabled && e.preventDefault()}
              sx={{
                ...styles.centerV,
                fontSize: "0.8rem",
                fontFamily: "Roboto",
                fontWeight: "bold",
                opacity: 0.8,
                letterSpacing: "0.085em",
                color: rest?.color ? rest.color : disabled ? "GrayText" : "primary.dark",
              }}
            >
              {icon}
              {title || <LoadingSkeleton width={"70px"} sx={{ borderRadius: 1 }} />}
            </MuiLink>
          </Box>
        );
      })}
    </Breadcrumbs>
  );
};

/**
 * fetch the passed arguments ids title
 */
export const useSupTitleBreadcrumb = (params: Record<string, string | undefined>) => {
  const { service } = useServiceContext();

  const { loading, data } = useQuery({
    service: (args = params, config) => service.fetchBreadcrumbInfo(args, config),
  });

  return {
    space: !loading ? data?.space_id || "spaces" : data?.space_id,
    assessment: !loading ? data?.assessment_id || "assessments" : data?.assessment_id,
    questionnaire: !loading ? data?.questionnaire_id || "questionnaires" : data?.questionnaire_id,
  };
};

export default SupTitleBreadcrumb;
