import React from "react";
import { Trans } from "react-i18next";
import { NavLink } from "react-router-dom";
import { styles } from "../../config/styles";
import { useAuthContext } from "../../providers/AuthProvider";
import AppBar from "@mui/material/AppBar";
import { Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CompareRoundedIcon from "@mui/icons-material/CompareRounded";

const drawerWidth = 240;

const Navbar = () => {
  const { userInfo } = useAuthContext();
  const { current_space } = userInfo;

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ pl: 1, pr: 1, textAlign: "center" }}
    >
      <Typography
        variant="h6"
        sx={{ my: 1, height: "40px", width: "100%", ...styles.centerVH }}
        component={NavLink}
        to={current_space?.id ? `/${current_space?.id}/assessments` : `/spaces`}
      >
        <Logo />
      </Typography>
      <Divider />
      <List dense>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: "left", borderRadius: 1.5 }}
            component={NavLink}
            to="spaces"
          >
            <ListItemText
              primary={
                <>
                  <Trans i18nKey="spaces" />
                  {current_space?.title && (
                    <Typography
                      variant="caption"
                      textTransform={"none"}
                      sx={{
                        pl: 0.5,
                        ml: 0.5,
                        lineHeight: "1",
                        borderLeft: (t) => `1px solid ${t.palette.grey[300]}`,
                      }}
                    >
                      {current_space?.title}
                    </Typography>
                  )}
                </>
              }
            />
          </ListItemButton>
        </ListItem>
        {current_space?.id && (
          <ListItem disablePadding>
            <ListItemButton
              sx={{ textAlign: "left", borderRadius: 1.5 }}
              component={NavLink}
              to={`/${current_space?.id}/assessments`}
            >
              <ListItemText primary={<Trans i18nKey="assessments" />} />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: "left", borderRadius: 1.5 }}
            component={NavLink}
            to={`/compare`}
          >
            <ListItemText primary={<Trans i18nKey="compare" />} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        component="nav"
        sx={{
          width: "calc(100% - 8px)",
          margin: "4px",
          borderRadius: "16px",
          background: "white",
        }}
      >
        <Toolbar variant="dense" sx={{ backgroundColor: "white" }}>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={NavLink}
            sx={{
              display: {
                xs: "none",
                md: "block",
                color: "grey",
                height: "48px",
                width: "110px",
              },
            }}
            to={
              current_space?.id
                ? `/${current_space?.id}/assessments`
                : `/spaces`
            }
          >
            <Logo />
          </Typography>
          <Box sx={{ display: { xs: "none", md: "block" }, ml: 3 }}>
            <Button
              component={NavLink}
              to="spaces"
              sx={{ ...styles.activeNavbarLink, ml: 0.1 }}
              startIcon={
                <FolderRoundedIcon
                  sx={{ opacity: 0.8, fontSize: "18px !important" }}
                />
              }
            >
              <Box sx={{ ...styles.centerV }}>
                <Trans i18nKey="spaces" />
                {current_space?.title && (
                  <Typography
                    variant="caption"
                    textTransform={"none"}
                    sx={{
                      pl: 0.5,
                      ml: 0.5,
                      lineHeight: "1",
                      borderLeft: (t) => `1px solid ${t.palette.grey[300]}`,
                    }}
                  >
                    {current_space?.title}
                  </Typography>
                )}
              </Box>
            </Button>
            {current_space?.id && (
              <Button
                component={NavLink}
                to={`/${current_space?.id}/assessments`}
                sx={{ ...styles.activeNavbarLink, ml: 0.1 }}
                startIcon={
                  <DescriptionRoundedIcon
                    sx={{ opacity: 0.8, fontSize: "18px !important" }}
                  />
                }
              >
                <Trans i18nKey="assessments" />
              </Button>
            )}
            <Button
              component={NavLink}
              to={`/compare`}
              startIcon={
                <CompareRoundedIcon
                  sx={{ opacity: 0.8, fontSize: "18px !important" }}
                />
              }
              sx={{ ...styles.activeNavbarLink, ml: 0.1 }}
            >
              <Trans i18nKey="compare" />
            </Button>
            <Button
              component={NavLink}
              to={`/profiles`}
              sx={{ ...styles.activeNavbarLink, ml: 0.1 }}
            >
              <Trans i18nKey="profiles" />
            </Button>
          </Box>
          <Box ml="auto">
            <Button
              sx={{ ml: 2, mr: "-8px", px: 1.5 }}
              size="small"
              component={NavLink}
              to="account"
              endIcon={<Avatar sx={{ width: 26, height: 26, ml: 1 }} />}
            >
              {userInfo.username}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={window.document.body}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

const Logo = () => {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="100%"
      height="100%"
      viewBox="0 0 990 250"
      enableBackground="new 0 0 990 250"
      xmlSpace="preserve"
    >
      <g>
        <path
          fill="#808080"
          d="M348.677,179.498c-23.926,2.145-43.773,3.218-59.539,3.218c-10.518,0-18.244-2.469-23.176-7.404
		c-4.936-4.933-7.4-12.657-7.4-23.173v-51.494c0-11.262,2.543-19.443,7.643-24.539c5.09-5.097,13.275-7.645,24.541-7.645h57.932
		v22.527h-51.494c-6.438,0-9.656,3.222-9.656,9.656v51.494c0,2.471,0.723,4.428,2.174,5.875c1.447,1.449,3.297,2.174,5.547,2.174
		c2.256,0,4.723-0.025,7.404-0.081c2.684-0.055,5.473-0.135,8.371-0.239c2.893-0.106,5.816-0.219,8.771-0.322
		c2.945-0.107,6.756-0.322,11.422-0.645s10.482-0.698,17.461-1.128V179.498z"
        />
        <path
          fill="#808080"
          d="M388.099,97.426c10.408-2.146,19.527-3.216,27.359-3.216h7.244c7.295,0,13.137,2.2,17.537,6.598
		c4.398,4.397,6.598,10.245,6.598,17.542v62.758h-28.158v-59.542c0-1.608-0.539-2.95-1.611-4.024
		c-1.076-1.07-2.414-1.607-4.023-1.607h-5.635c-4.078,0-7.803,0.215-11.182,0.644c-3.379,0.431-6.088,0.751-8.129,0.964v63.566
		h-28.16V68.461h28.16V97.426z"
        />
        <path
          fill="#808080"
          d="M540.173,179.498c-20.705,2.145-39.48,3.218-56.32,3.218c-7.301,0-13.145-2.197-17.543-6.599
		c-4.4-4.395-6.598-10.244-6.598-17.539v-38.621c0-8.047,2.277-14.348,6.838-18.91c4.561-4.557,10.861-6.837,18.91-6.837h32.184
		c8.045,0,14.348,2.28,18.908,6.837c4.561,4.563,6.842,10.863,6.842,18.91v29.771H487.87v6.437c0,1.608,0.539,2.953,1.609,4.023
		c1.076,1.072,2.414,1.606,4.025,1.606c10.623,0,26.176-0.804,46.668-2.41V179.498z M494.31,114.324
		c-4.293,0-6.439,2.146-6.439,6.438v8.849h27.359v-8.849c0-4.292-2.148-6.438-6.439-6.438H494.31z"
        />
        <path
          fill="#808080"
          d="M633.511,179.498c-20.064,2.145-37.77,3.218-53.109,3.218c-7.297,0-13.143-2.197-17.543-6.599
		c-4.398-4.395-6.594-10.244-6.594-17.539v-37.013c0-8.045,2.273-14.348,6.834-18.909c4.563-4.558,10.865-6.839,18.91-6.839h51.502
		v21.724h-42.652c-4.287,0-6.432,2.148-6.432,6.438v31.378c0,1.611,0.535,2.955,1.609,4.026c1.066,1.07,2.412,1.606,4.02,1.606
		c9.654,0,24.143-0.803,43.455-2.412V179.498z"
        />
        <path
          fill="#808080"
          d="M674.538,147.313v33.795h-28.156V68.461h28.156v57.126h12.879l17.695-29.77h29.773l-24.139,41.035
		l24.139,44.255h-29.773l-18.5-33.795H674.538z"
        />
        <path
          fill="#808080"
          d="M816.954,68.461h28.967v82.072c0,11.261-2.551,19.445-7.648,24.54c-5.092,5.095-13.271,7.643-24.535,7.643
		h-37.016c-11.262,0-19.449-2.548-24.543-7.643c-5.096-5.095-7.641-13.279-7.641-24.54V68.461h28.969v82.072
		c0,6.436,3.215,9.654,9.654,9.654h24.137c6.439,0,9.656-3.219,9.656-9.654V68.461z"
        />
        <path
          fill="#808080"
          d="M891.778,181.107v27.354h-28.154V95.817h24.938l1.607,8.048c5.047-3.326,10.219-5.767,15.535-7.324
		c5.305-1.553,9.787-2.331,13.436-2.331h7.242c7.295,0,13.143,2.2,17.541,6.598c4.395,4.397,6.594,10.245,6.594,17.542v37.008
		c0,8.046-2.279,14.35-6.832,18.911c-4.57,4.561-10.871,6.839-18.912,6.839H891.778z M911.091,117.541
		c-5.688,0-12.117,1.074-19.313,3.222v38.621h24.145c4.289,0,6.432-2.146,6.432-6.44v-29.771c0-1.607-0.533-2.949-1.609-4.02
		c-1.072-1.071-2.412-1.612-4.018-1.612H911.091z"
        />
        <linearGradient
          id="SVGID_1_"
          gradientUnits="userSpaceOnUse"
          x1="39.752"
          y1="125.3828"
          x2="205.752"
          y2="125.3828"
        >
          <stop offset="0" style={{ stopColor: "#6034A5" }} />
          <stop offset="0.8081" style={{ stopColor: "#744DB0" }} />
          <stop offset="1" style={{ stopColor: "#7954B3" }} />
        </linearGradient>
        <path
          fill="url(#SVGID_1_)"
          d="M183.752,113.881v66.902c0,2.001-1.605,4.6-3.604,4.6H68.468c-1.999,0-3.716-2.599-3.716-4.6V68.168
		c0-2,1.717-2.785,3.716-2.785h117.31l-11.729-24H68.468c-14.969,0-28.716,11.814-28.716,26.785v112.615
		c0,14.969,13.747,28.6,28.716,28.6h111.68c14.969,0,25.604-13.631,25.604-28.6V90.104L183.752,113.881z"
        />
        <linearGradient
          id="SVGID_2_"
          gradientUnits="userSpaceOnUse"
          x1="94.2266"
          y1="97.1201"
          x2="124.7301"
          y2="44.3767"
        >
          <stop offset="0" style={{ stopColor: "#5AD0AF", stopOpacity: 0 }} />
          <stop
            offset="0.1548"
            style={{ stopColor: "#4FB79A", stopOpacity: 0.1548 }}
          />
          <stop
            offset="0.4852"
            style={{ stopColor: "#347563", stopOpacity: 0.4852 }}
          />
          <stop
            offset="0.9619"
            style={{ stopColor: "#090E0C", stopOpacity: 0.9619 }}
          />
          <stop offset="1" style={{ stopColor: "#7954B3" }} />
        </linearGradient>
        <path
          fill="url(#SVGID_2_)"
          d="M64.752,92.834V68.168c0-2,1.716-2.785,3.716-2.785h119.125l-64.927-24H68.468
		c-14.969,0-28.716,11.814-28.716,26.785v16.377L64.752,92.834z"
        />
        <linearGradient
          id="SVGID_3_"
          gradientUnits="userSpaceOnUse"
          x1="104.584"
          y1="157.3535"
          x2="149.418"
          y2="27.6339"
        >
          <stop offset="0" style={{ stopColor: "#3BC7A0" }} />
          <stop offset="0.1686" style={{ stopColor: "#41C9A3" }} />
          <stop offset="1" style={{ stopColor: "#5AD0AF" }} />
        </linearGradient>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="url(#SVGID_3_)"
          d="M204.144,59.628
		c-4.542-10.081-12.551-16.546-22.875-17.813L69.841,42.013c49.596,6.273,109.876,23.398,109.876,23.398l0,0
		c1.16,0.56,2.157,1.685,2.884,3.153c1.843,3.715,0.252,6.809-2.446,9.583c-15.024,15.441-30.068,30.788-45.06,46.262
		c-1.291,1.332-2.647,2.386-4.002,2.692l-12.042-11.719H86.659h-2.538l14.521,13.637l0.006-0.028
		c9.279,9.008,18.65,17.904,27.7,27.135c4.228,4.311,6.94,3.761,10.881-0.347c19.681-20.512,39.675-40.624,59.421-61.077
		C206.343,84.663,210.268,73.214,204.144,59.628z"
        />
      </g>
    </svg>
  );
};

export default Navbar;
