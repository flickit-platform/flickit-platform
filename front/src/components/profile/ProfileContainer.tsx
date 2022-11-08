import React from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { authActions, useAuthContext } from "../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { styles } from "../../config/styles";

const ProfileContainer = () => {
  return (
    <Box m="auto">
      <Box>
        <ProfileSettings />
      </Box>
    </Box>
  );
};

function ProfileSettings() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            <Tab
              label={
                <Box sx={{ ...styles.centerV }}>
                  <AccountBoxRoundedIcon fontSize="small" sx={{ mr: "8px" }} />
                  <Trans i18nKey="accountSetting" />
                </Box>
              }
              value="1"
            />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <Box mt={3}>
            <About />
          </Box>
          <Box mt={16} borderTop={"1px solid #cfc7c7"} pt={1}>
            <Grid container spacing={4}>
              <Grid item md={4} sm={6} xs={12}>
                <Typography
                  sx={{ opacity: 0.85 }}
                  fontSize={"1rem"}
                  fontFamily="RobotoMedium"
                  letterSpacing=".05rem"
                >
                  <Trans i18nKey="signOutOfYourAccount" />
                </Typography>
                <SignOut />
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

const About = () => {
  const { userInfo } = useAuthContext();
  const { username } = userInfo;

  return (
    <Box sx={{ ...styles.centerV }}>
      <Avatar sx={{ width: "64px", height: "64px" }} />
      <Box ml={2}>
        <Typography variant="h6">{username}</Typography>
      </Box>
    </Box>
  );
};

const SignOut = () => {
  const { dispatch } = useAuthContext();

  return (
    <Box maxWidth="340px" mt={2}>
      <Button
        variant="contained"
        color="warning"
        fullWidth
        onClick={() => {
          dispatch(authActions.setUserInfo());
          dispatch(authActions.signOut());
        }}
      >
        <Trans i18nKey="signOut" />
      </Button>
    </Box>
  );
};

export default ProfileContainer;
