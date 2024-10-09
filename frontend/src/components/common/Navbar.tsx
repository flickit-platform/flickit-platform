import React, { useEffect, useRef, useState } from "react";
import { Trans } from "react-i18next";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { styles } from "@styles";
import { authActions, useAuthContext } from "@providers/AuthProvider";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import ListItemIcon from "@mui/material/ListItemIcon";
import Badge from "@mui/material/Badge";
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
import {
  ButtonTypeEnum,
  IMessage,
  NotificationCenter,
} from "@novu/notification-center";
import { FaBell } from "react-icons/fa";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import NotificationEmptyState from "@/assets/svg/notificationEmptyState.svg";
import { format } from "date-fns";
import { secondaryFontFamily, theme } from "@/config/theme";
import LanguageSelector from "./LangSelector";
import { t } from "i18next";

const drawerWidth = 240;

const NotificationIndicator = ({ seen }: { seen: boolean }) => (
  <Box
    sx={{
      minWidth: "4px",
      height: "24px",
      backgroundColor: seen ? "#6C8093" : "#2D80D2",
      borderRadius: "2px",
      marginRight: theme.direction === "ltr" ? 1 : "unset",
      marginLeft: theme.direction === "rtl" ? 1 : "unset",
    }}
  />
);

const NotificationItem = ({
  message,
  onNotificationClick,
}: {
  message: any;
  onNotificationClick: any;
}) => {
  return (
    <Box
      onClick={onNotificationClick}
      sx={{
        marginBlock: "4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        border: "0.5px solid #C7CCD1",
        backgroundColor: message.seen ? "#ffffff" : "#F3F5F6",
        cursor: "pointer",
        position: "relative",
        flexDirection: theme.direction === "rtl" ? "row-reverse" : "row", // Handle RTL/LTR
        "&:hover": {
          backgroundColor: "#f1f1f1",
        },
      }}
    >
      {/* Blue Indicator for Unseen Messages */}
      <NotificationIndicator seen={message.seen} />

      {/* Notification Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          display: "flex",
          alignItems: "center",
          justifyContent: theme.direction === "rtl" ? "flex-end" : "flex-start",
        }}
      >
        <Typography
          variant="titleSmall"
          sx={{
            fontWeight: message.seen ? 400 : 600,
            color: "#2B333B",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {message.content as string}
        </Typography>
      </Box>

      {/* Relative Time Ago */}
      <Typography
        variant="labelSmall"
        sx={{
          color: "#3D4D5C",
          marginLeft: theme.direction === "rtl" ? "0" : "8px",
          marginRight: theme.direction === "rtl" ? "8px" : "0",
          whiteSpace: "nowrap",
        }}
      >
        {t(convertToRelativeTime(message.createdAt))}
      </Typography>

      {/* Arrow Icon */}
      <ArrowForwardIos
        sx={{
          fontSize: "16px",
          color: "#2962FF",
          marginLeft: theme.direction === "rtl" ? "0" : "8px",
          marginRight: theme.direction === "rtl" ? "8px" : "0",
          transform: theme.direction === "rtl" ? "rotate(180deg)" : "none", // Rotate for RTL
        }}
      />

      {/* Red Dot Indicator for Unseen Message */}
      <Box
        sx={{
          position: "absolute",
          top: "8px",
          left: theme.direction === "rtl" ? "8px" : "unset",
          right: theme.direction === "ltr" ? "8px" : "unset",
          width: "8px",
          height: "8px",
          backgroundColor: "#B8144B",
          borderRadius: "50%",
          display: message.seen ? "none" : "block",
        }}
      />
    </Box>
  );
};

const NotificationCenterComponent = ({ setNotificationCount }: any) => {
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
  const [notificationCount, setNotificationsCount] = useState(0);

  const handleUnseenCountChanged = (unseenCount: number) => {
    setNotificationCount(unseenCount);
    setNotificationsCount(unseenCount);
  };

  const handleNotificationClick = (
    message: IMessage,
    onNotificationClick: () => void,
  ) => {
    setSelectedMessage(message);
    onNotificationClick();
  };

  const handleBackClick = () => {
    setSelectedMessage(null);
  };

  return (
    <Box>
      {selectedMessage ? (
        // Full Message View
        <Box
          className="nc-layout-wrapper"
          sx={{
            borderRadius: 1,
            width: { md: 420, sm: 320 },
          }}
        >
          <Box
            className="nc-header"
            sx={{ display: "flex", height: "55px", alignItems: "center" }}
          >
            <Typography
              className="nc-header-title"
              sx={{
                color: "#525266",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "24px",
                textAlign: "left",
                fontFamily: secondaryFontFamily,
              }}
            >
              <IconButton onClick={handleBackClick}>
                <ArrowBackIos
                  sx={{
                    fontSize: "16px",
                  }}
                />{" "}
              </IconButton>
              <Trans i18nKey="notificationDetails" />
            </Typography>
          </Box>

          <Box className="nc-notifications-list" sx={{ height: 400 }}>
            <Box
              sx={{
                marginBlock: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                backgroundColor: "#FFFFFF",
                position: "relative", // Keeps the relative positioning for absolute elements
              }}
            >
              {/* Blue Indicator for Unseen Messages */}
              <Box
                sx={{
                  position: "absolute",
                  left: theme.direction === "ltr" ? 8 : "unset",
                  right: theme.direction === "rtl" ? 8 : "unset",
                  top: 8,
                  bottom: 0,
                  width: "4px",
                  backgroundColor: selectedMessage.seen ? "#6C8093" : "#2D80D2",
                  borderRadius: "2px",
                }}
              />

              <Box
                sx={{
                  paddingLeft: "12px",
                  gap: "4px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="titleMedium">
                  {(selectedMessage as any)?.payload?.title}
                </Typography>
                {/* Added padding to make room for the indicator */}
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                  gap={1}
                >
                  {/* <Avatar sx={{ width: 24, height: 24 }}></Avatar> */}
                  <Typography variant="bodyMedium">
                    {(selectedMessage as any)?.content}
                    {/* <Typography
                      variant="titleSmall"
                      component="span"
                      sx={{ fontWeight: "bold", color: "#2D80D2" }}
                    >
                      {
                        (selectedMessage?.payload?.data as any)?.assigner
                          ?.displayName
                      }
                    </Typography>{" "}
                    just added you to the assessment{" "}
                    <Typography
                      variant="titleSmall"
                      component="span"
                      sx={{ fontWeight: "bold", color: "#2D80D2" }}
                    >
                      {
                        (selectedMessage?.payload?.data as any)?.assessment
                          ?.title
                      }
                    </Typography>{" "}
                    as{" "}
                    <Typography
                      variant="titleSmall"
                      component="span"
                      sx={{ fontWeight: "bold", color: "#2D80D2" }}
                    >
                      {(selectedMessage?.payload?.data as any)?.role?.title}
                    </Typography>{" "}
                    on the space! */}
                  </Typography>
                </Box>
                {/* Relative Time Ago */}
                <Typography
                  variant="labelSmall"
                  sx={{
                    color: "#3D4D5C",
                  }}
                >
                  {t(
                    convertToRelativeTime(selectedMessage.createdAt) +
                      " (" +
                      format(
                        new Date(
                          new Date(selectedMessage.createdAt).getTime() -
                            new Date(
                              selectedMessage.createdAt,
                            ).getTimezoneOffset(),
                        ),
                        "yyyy/MM/dd HH:mm",
                      ) +
                      ") ",
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <NotificationCenter
          // header={({ setScreen, screen }) => (
          //   <Box
          //     display="flex"
          //     justifyContent="space-between"
          //     alignItems="center"
          //     sx={{ padding: "16px", borderBottom: "1px solid #e0e0e0" }}
          //   >
          //     <Typography variant="h6">
          //       <Trans i18nKey="notificationHeader" />
          //     </Typography>
          //     {notificationCount}

          //     <Button
          //       variant="outlined"
          //       // onClick={handleMarkAllAsRead} // Action handler
          //       // startIcon={<DoneAllIcon />}
          //     >
          //       <Trans i18nKey="markAllAsRead" />
          //     </Button>
          //   </Box>
          // )}
          onUnseenCountChanged={(unseenCount: number) =>
            handleUnseenCountChanged(unseenCount)
          }
          showUserPreferences={false}
          colorScheme="light"
          emptyState={
            <Box
              width="100%"
              height="400px"
              sx={{ ...styles.centerCVH }}
              gap={1}
            >
              <img src={NotificationEmptyState} alt={"No assesment here!"} />
              <Typography variant="bodyMedium" color="#2466A8">
                <Trans i18nKey="notificationEmptyState" />
              </Typography>
            </Box>
          }
          listItem={(
            message: IMessage,
            onActionButtonClick: (actionButtonType: ButtonTypeEnum) => void,
            onNotificationClick: () => void,
          ) => {
            return (
              <NotificationItem
                message={message}
                onNotificationClick={() =>
                  handleNotificationClick(message, onNotificationClick)
                }
              />
            );
          }}
        />
      )}
    </Box>
  );
};

const Navbar = () => {
  const { userInfo, dispatch } = useAuthContext();
  const { config } = useConfigContext();
  const { spaceId } = useParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const notificationCenterRef = useRef(null);
  const bellButtonRef = useRef(null);
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
        event.target,
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
      sx={{
        paddingLeft: theme.direction === "ltr" ? 2 : "unset",
        paddingRight: theme.direction === "rtl" ? 2 : "unset",
        pr: 1,
        textAlign: "center",
      }}
    >
      {/* Drawer content */}
      <Typography
        variant="h6"
        sx={{ my: 1, height: "40px", width: "100%", ...styles.centerVH }}
        component={NavLink}
        to={spaceId ? `/${spaceId}/assessments/1` : `/spaces/1`}
      >
        <img
          src={config.appLogoUrl}
          alt={"logo"}
          width={"224px"}
          height={"40px"}
        />
      </Typography>
      <Divider />
      <List dense>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ textAlign: "left", borderRadius: 1.5 }}
            component={NavLink}
            to="spaces/1"
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
                                      paddingLeft:
                                        theme.direction === "ltr"
                                          ? 0.5
                                          : "unset",
                                      paddingRight:
                                        theme.direction === "rtl"
                                          ? 0.5
                                          : "unset",
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
          borderRadius: "0px",
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
            sx={{
              marginRight: theme.direction === "ltr" ? 1 : "unset",
              marginLeft: theme.direction === "rtl" ? 1 : "unset",
              display: { md: "none" },
            }}
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
              sx={{
                ...styles.activeNavbarLink,
                marginRight: theme.direction === "ltr" ? 0.8 : 0.1,
                marginLeft: theme.direction === "rtl" ? 0.8 : 0.1,
              }}
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: theme.direction === "rtl" ? "unset" : "auto",
              mr: theme.direction !== "rtl" ? "unset" : "auto",
            }}
          >
            <IconButton onClick={toggleNotificationCenter} ref={bellButtonRef}>
              <Badge
                max={99}
                badgeContent={notificationCount}
                color="error"
                overlap="circular"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#B8144B",
                    minWidth: "16px",
                    padding: 0,
                    height: "16px",
                  },
                }}
              >
                <FaBell size={20} color="grey" />
              </Badge>
            </IconButton>

            <AccountDropDownButton userInfo={userInfo} />
          </Box>
          <LanguageSelector />
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
          sx={{
            position: "fixed",
            top: 60,
            right: theme.direction === "ltr" ? 20 : "unset",
            left: theme.direction === "rtl" ? 20 : "unset",
            zIndex: 1300,
          }}
        >
          <NotificationCenterComponent
            setNotificationCount={setNotificationCount}
          />
        </Box>
      )}

      {/* Hidden Notification Center for Count Update */}
      <Box sx={{ display: "none" }}>
        <NotificationCenterComponent
          setNotificationCount={setNotificationCount}
        />
      </Box>
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
          marginRight: theme.direction === "ltr" ? 0.8 : 0.1,
          marginLeft: theme.direction === "rtl" ? 0.8 : 0.1,
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
        PaperProps={{
          sx: {
            left:
              theme.direction === "ltr"
                ? "165px !important"
                : "unset !important",
            right: theme.direction === "rtl" ? "130px !important" : "unset",
            minWidth: "260px",
          },
        }}
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
        sx={{
          ...styles.activeNavbarLink,
          marginRight: theme.direction === "ltr" ? 0.8 : 0.1,
          marginLeft: theme.direction === "rtl" ? 0.8 : 0.1,
        }}
        size="small"
        endIcon={
          open ? <ArrowDropUpRoundedIcon /> : <ArrowDropDownRoundedIcon />
        }
      >
        <Avatar
          sx={{
            width: 26,
            height: 26,
            marginRight: theme.direction === "ltr" ? 1.3 : "unset",
            marginLeft: theme.direction === "rtl" ? 1.3 : "unset",
          }}
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
