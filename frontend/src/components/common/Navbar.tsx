import React, { useEffect } from "react";
import { Trans } from "react-i18next";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { styles } from "@styles";
import { authActions, useAuthContext } from "@providers/AuthProvider";
import AppBar from "@mui/material/AppBar";
import { Box, ListItemIcon } from "@mui/material";
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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import EngineeringIcon from "@mui/icons-material/Engineering";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import QueryData from "@common/QueryData";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { ISpacesModel } from "@types";
import CompareRoundedIcon from "@mui/icons-material/CompareRounded";
import keycloakService from "@/service//keycloakService";
const drawerWidth = 240;

const Navbar = () => {
  const { userInfo, dispatch } = useAuthContext();
  const { spaceId } = useParams();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const { service } = useServiceContext();
  const spacesQueryData = useQuery<ISpacesModel>({
    service: (args, config) => service.fetchSpaces(args, config),
    toastError: true,
  });
  const fetchPathInfo = useQuery({
    service: (args, config) =>
      service.fetchPathInfo({ spaceId, ...(args || {}) }, config),
    runOnMount: false,
  });
  const fetchSpaceInfo = async () => {
    try {
      const res = await fetchPathInfo.query();
      dispatch(authActions.setCurrentSpace(res?.space));
    } catch (e) {}
  };
  useEffect(() => {
    if (spaceId) {
      fetchSpaceInfo();
    }
  }, [spaceId]);
  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ pl: 1, pr: 1, textAlign: "center" }}
    >
      <Typography
        variant="h6"
        sx={{ my: 1, height: "40px", width: "100%", ...styles.centerVH }}
        component={NavLink}
        to={spaceId ? `/${spaceId}/assessments/1` : `/spaces`}
      >
        <NavLogo />
      </Typography>
      <Divider />
      <List dense>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: "left", borderRadius: 1.5 }}
            component={NavLink}
            to="spaces"
          >
            <ListItemText primary={<Trans i18nKey="spaces" />} />
          </ListItemButton>
        </ListItem>
        {spaceId && (
          <QueryData
            {...spacesQueryData}
            render={(data) => {
              const { items } = data;
              return (
                <Box>
                  {items.slice(0, 5).map((space: any) => {
                    return (
                      <ListItem disablePadding key={space?.id}>
                        <ListItemButton
                          sx={{ textAlign: "left", borderRadius: 1.5 }}
                          component={NavLink}
                          to={`/${space?.id}/assessments/1`}
                        >
                          <ListItemText
                            primary={
                              <>
                                {space?.title && (
                                  <Typography
                                    variant="caption"
                                    textTransform={"none"}
                                    sx={{
                                      pl: 0.5,
                                      ml: 0.5,
                                      lineHeight: "1",
                                      borderLeft: (t) =>
                                        `1px solid ${t.palette.grey[300]}`,
                                    }}
                                  >
                                    {space?.title}
                                  </Typography>
                                )}
                              </>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                  <Divider />
                </Box>
              );
            }}
          />
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
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: "left", borderRadius: 1.5 }}
            component={NavLink}
            to={`/assessment-kits`}
          >
            <ListItemText primary={<Trans i18nKey="assessmentKits" />} />
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
        data-cy="nav-bar"
      >
        <Toolbar
          variant="dense"
          sx={{ backgroundColor: "white", borderRadius: 1 }}
        >
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
                height: "42px",
                width: "110px",
              },
            }}
            to={`/spaces`}
          >
            <NavLogo />
          </Typography>
          <Box sx={{ display: { xs: "none", md: "block" }, ml: 3 }}>
            <SpacesButton />
            <Button
              component={NavLink}
              to={`/compare`}
              startIcon={
                <CompareRoundedIcon
                  sx={{ opacity: 0.8, fontSize: "18px !important" }}
                />
              }
              sx={{ ...styles.activeNavbarLink, ml: 0.1, mr: 0.8 }}
              size="small"
            >
              <Trans i18nKey="compare" />
            </Button>
            <Button
              component={NavLink}
              to={`/assessment-kits`}
              sx={{ ...styles.activeNavbarLink, ml: 0.1 }}
              size="small"
              startIcon={
                <AssessmentRoundedIcon
                  sx={{ opacity: 0.8, fontSize: "18px !important" }}
                />
              }
            >
              <Trans i18nKey="assessmentKits" />
            </Button>
          </Box>
          <Box ml="auto">
            <AccountDropDownButton userInfo={userInfo} />
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

const NavLogo = () => {
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
      viewBox="0 0 787 250"
      enableBackground="new 0 0 787 250"
      xmlSpace="preserve"
    >
      <g>
        <linearGradient
          id="SVGID_1_"
          gradientUnits="userSpaceOnUse"
          x1="30"
          y1="138"
          x2="196"
          y2="138"
        >
          <stop offset="0" style={{ stopColor: "#6034A5" }} />
          <stop offset="0.8081" style={{ stopColor: "#744DB0" }} />
          <stop offset="1" style={{ stopColor: "#7954B3" }} />
        </linearGradient>
        <path
          fill="url(#SVGID_1_)"
          d="M174,126.498V193.4c0,2.001-1.605,4.6-3.604,4.6H58.716c-1.999,0-3.716-2.599-3.716-4.6V80.785
		c0-2,1.717-2.785,3.716-2.785h117.31l-11.729-24H58.716C43.747,54,30,65.814,30,80.785V193.4c0,14.969,13.747,28.6,28.716,28.6
		h111.68C185.364,222,196,208.369,196,193.4v-90.679L174,126.498z"
        />
        <linearGradient
          id="SVGID_2_"
          gradientUnits="userSpaceOnUse"
          x1="84.4766"
          y1="109.7373"
          x2="114.9801"
          y2="56.9939"
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
          <stop offset="1" style={{ stopColor: "#050505" }} />
        </linearGradient>
        <path
          fill="url(#SVGID_2_)"
          d="M55,105.451V80.785c0-2,1.716-2.785,3.716-2.785h119.125l-64.927-24H58.716
		C43.747,54,30,65.814,30,80.785v16.377L55,105.451z"
        />
        <linearGradient
          id="SVGID_3_"
          gradientUnits="userSpaceOnUse"
          x1="94.833"
          y1="169.9707"
          x2="139.6673"
          y2="40.2501"
        >
          <stop offset="0" style={{ stopColor: "#3BC7A0" }} />
          <stop offset="0.1686" style={{ stopColor: "#41C9A3" }} />
          <stop offset="1" style={{ stopColor: "#5AD0AF" }} />
        </linearGradient>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="url(#SVGID_3_)"
          d="M194.392,72.245
		c-4.542-10.081-12.551-16.546-22.875-17.813L60.089,54.63c49.596,6.273,109.876,23.398,109.876,23.398l0,0
		c1.16,0.56,2.157,1.685,2.884,3.153c1.843,3.715,0.252,6.809-2.446,9.583c-15.024,15.441-30.068,30.788-45.06,46.262
		c-1.291,1.332-2.647,2.386-4.002,2.692L109.299,128H76.907h-2.538l14.521,13.637l0.006-0.028c9.279,9.008,18.65,17.904,27.7,27.135
		c4.228,4.311,6.94,3.761,10.881-0.347c19.681-20.512,39.675-40.624,59.421-61.077C196.591,97.28,200.516,85.831,194.392,72.245z"
        />
      </g>
      <g>
        <path
          fill="#6D6D6D"
          d="M277.233,194.082h-28.566V82.993h88.077v22.219h-59.511v26.185h46.815v22.219h-46.815V194.082z"
        />
        <path
          fill="#6D6D6D"
          d="M389.115,194.082c-7.094,1.056-13.835,1.585-20.236,1.585s-11.772-2.165-16.105-6.506
		c-4.34-4.336-6.509-10.1-6.509-17.298v-88.87h27.773v84.903c0,1.59,0.527,2.912,1.588,3.967c1.056,1.062,2.379,1.59,3.964,1.59
		h9.525V194.082z"
        />
        <path
          fill="#6D6D6D"
          d="M435.135,113.147v80.935H407.36V134.57h-11.9v-21.423H435.135z M407.36,81.407h27.774v22.219H407.36V81.407
		z"
        />
        <path
          fill="#6D6D6D"
          d="M525.591,192.497c-19.786,2.112-37.242,3.17-52.37,3.17c-7.194,0-12.959-2.165-17.298-6.506
		c-4.339-4.336-6.507-10.1-6.507-17.298v-36.5c0-7.934,2.244-14.146,6.745-18.645c4.494-4.498,10.711-6.744,18.647-6.744h50.782
		v21.422h-42.055c-4.233,0-6.349,2.119-6.349,6.349v30.944c0,1.589,0.53,2.912,1.588,3.971c1.056,1.057,2.382,1.585,3.967,1.585
		c9.523,0,23.804-0.792,42.849-2.382V192.497z"
        />
        <path
          fill="#6D6D6D"
          d="M566.058,160.756v33.326h-27.774V82.993h27.774v56.337h12.696l17.456-29.355h29.358l-23.804,40.467
		l23.804,43.641H596.21l-18.252-33.326H566.058z"
        />
        <path
          fill="#6D6D6D"
          d="M668.414,113.147v80.935h-27.771V134.57H628.74v-21.423H668.414z M640.644,81.407h27.771v22.219h-27.771
		V81.407z"
        />
        <path
          fill="#6D6D6D"
          d="M743,194.082c-10.261,1.056-20.313,1.585-30.151,1.585c-7.195,0-12.962-2.165-17.298-6.506
		c-4.34-4.336-6.506-10.1-6.506-17.298v-40.467h-9.523v-21.422h9.523l3.173-19.045h24.598v19.045h19.837v21.422h-19.837v36.5
		c0,1.59,0.527,2.912,1.588,3.967c1.056,1.062,2.379,1.59,3.967,1.59H743V194.082z"
        />
      </g>
    </svg>
  );
};

const SpacesButton = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { dispatch } = useAuthContext();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickMenueItem = (space: any) => {
    dispatch(authActions.setCurrentSpace(space));
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const { service } = useServiceContext();

  const spacesQueryData = useQuery<ISpacesModel>({
    service: (args, config) => service.fetchSpaces(args, config),
    toastError: true,
  });

  return (
    <>
      <Button
        data-cy="spaces"
        onClick={() => navigate("/spaces")}
        sx={{
          ...styles.activeNavbarLink,
          ml: 0.1,
          mr: 0.8,
          "&:hover .MuiButton-endIcon > div": {
            borderLeftColor: "#8080802b",
          },
        }}
        startIcon={
          <FolderRoundedIcon
            sx={{ opacity: 0.8, fontSize: "18px !important" }}
          />
        }
        size="small"
        endIcon={
          <Box
            sx={{
              minWidth: "8px",
              ml: 0.6,
              px: 0.2,
              borderLeft: "1px solid #80808000",
              transition: "border .1s ease",
              display: "flex",
            }}
            onClick={(e: any) => {
              e.stopPropagation();
              handleClick(e);
            }}
          >
            {open ? <ArrowDropUpRoundedIcon /> : <ArrowDropDownRoundedIcon />}
          </Box>
        }
      >
        <Trans i18nKey={"spaces"} />
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { left: "165px !important", minWidth: "260px" } }}
      >
        <QueryData
          {...spacesQueryData}
          render={(data) => {
            const { items } = data;
            return (
              <Box>
                <Typography
                  variant="subMedium"
                  sx={{ px: 1.2, py: 0.3, opacity: 0.8 }}
                >
                  <Trans i18nKey={"recentSpaces"} />
                </Typography>
                {items.slice(0, 5).map((space: any) => {
                  return (
                    <MenuItem
                      key={space?.id}
                      dense
                      component={NavLink}
                      to={`/${space?.id}/assessments/1`}
                      onClick={() => handleClickMenueItem(space)}
                    >
                      {space?.title}
                    </MenuItem>
                  );
                })}
                <Divider />
              </Box>
            );
          }}
        />
        <MenuItem
          dense
          onClick={handleClose}
          component={NavLink}
          to={`/spaces`}
        >
          <Trans i18nKey={"spaceDirectory"} />
        </MenuItem>
      </Menu>
    </>
  );
};

const AccountDropDownButton = ({ userInfo }: any) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        data-cy="spaces"
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e);
        }}
        sx={{ ...styles.activeNavbarLink, ml: 0.1, mr: 0.8 }}
        size="small"
        endIcon={
          open ? <ArrowDropUpRoundedIcon /> : <ArrowDropDownRoundedIcon />
        }
      >
        <Avatar
          sx={{ width: 26, height: 26, mr: 1.3 }}
          alt={userInfo.display_name}
          src={userInfo.picture || ""}
        />
        {userInfo.display_name}
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { minWidth: "180px" } }}
      >
        <MenuItem
          dense
          component={NavLink}
          to={`/user/account`}
          onClick={handleClose}
        >
          <ListItemIcon>
            <AccountBoxRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Trans i18nKey={"account"} />
          </ListItemText>
        </MenuItem>
        <MenuItem
          dense
          onClick={handleClose}
          component={NavLink}
          to={`/user/expert-groups`}
        >
          <ListItemIcon>
            <EngineeringIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {" "}
            <Trans i18nKey={"expertGroups"} />
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          dense
          onClick={() => {
            keycloakService.doLogout();
          }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {" "}
            <Trans i18nKey={"signOut"} />
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
