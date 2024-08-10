import React, { useEffect, useRef, useState } from "react";
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
import { useConfigContext } from "@/providers/ConfgProvider";
import { NotificationCenter, NovuProvider } from "@novu/notification-center";
import { FaBell } from "react-icons/fa";

const drawerWidth = 240;

const Navbar = () => {
  const { userInfo } = useAuthContext();
  const { config } = useConfigContext();
  const { spaceId } = useParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const notificationCenterRef = useRef(null);
  const bellButtonRef = useRef(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleNotificationCenter = () => {
    setNotificationCenterOpen(!notificationCenterOpen);
  };

  const handleClickOutside = (event: any) => {
    if (
      notificationCenterRef.current &&
      !(notificationCenterRef.current as HTMLButtonElement).contains(
        event.target
      ) &&
      bellButtonRef.current &&
      !(bellButtonRef.current as HTMLButtonElement).contains(event.target)
    ) {
      setNotificationCenterOpen(false);
    }
  };

  useEffect(() => {
    if (notificationCenterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationCenterOpen]);

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ pl: 1, pr: 1, textAlign: "center" }}
    >
      {/* Drawer content */}
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
            to={`/spaces/1`}
          >
            <img src={config.appLogoUrl} alt={"logo"} />
          </Typography>
          <Box sx={{ display: { xs: "none", md: "block" }, ml: 3 }}>
            <SpacesButton />
            <Button
              component={NavLink}
              to={`/compare`}
              startIcon={
                <CompareRoundedIcon
                  sx={{ opacity: 0.8, fontSize: "1.125rem !important" }}
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
          <Box sx={{ display: { xs: "none", md: "block" }, ml: 3 }}>
            {/* Other buttons */}
          </Box>
          <Box ml="auto" sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={toggleNotificationCenter}
              ref={bellButtonRef} // Attach the ref to the bell button
            >
              <FaBell size={20} color="grey" />
            </IconButton>
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
      {/* Notification Center */}
      {notificationCenterOpen && (
        <Box
          ref={notificationCenterRef}
          sx={{ position: "absolute", top: 60, right: 20, zIndex: 1300 }}
        >
          <NotificationCenter colorScheme="light" />
        </Box>
      )}
    </>
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
        onClick={() => navigate("/spaces/1")}
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
          to={`/spaces/1`}
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
          alt={userInfo.displayName}
          src={userInfo.pictureLink || ""}
        />
        {userInfo.displayName}
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
