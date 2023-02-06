import React, { useEffect, useLayoutEffect } from "react";
import { Box, IconButton } from "@mui/material";
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
import { useNavigate, useParams } from "react-router-dom";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { styles } from "../../config/styles";
import ExpertGroupsContainer from "../expert-groups/ExpertGroupsContainer";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import AccountCEFormDialog from "./AccountCEFormDialog";
import useDialog from "../../utils/useDialog";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";

const AccountContainer = () => {
  return (
    <Box m="auto">
      <Box>
        <AccountSettings />
      </Box>
    </Box>
  );
};

function AccountSettings() {
  const { accountTab } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = React.useState(accountTab as string);

  useEffect(() => {
    if (!["about", "expert-groups"].includes(accountTab as string)) {
      navigate(`/account/about`, { replace: true });
      setValue("about");
    }
  }, []);

  useEffect(() => {
    if (accountTab && accountTab !== value) {
      setValue(accountTab);
    }
  }, [accountTab]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(`/account/${newValue}`);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box>
          <TabList
            onChange={handleChange}
            scrollButtons="auto"
            variant="scrollable"
          >
            <Tab
              label={
                <Box sx={{ ...styles.centerV }}>
                  <AccountBoxRoundedIcon fontSize="small" sx={{ mr: "8px" }} />
                  <Trans i18nKey="accountSetting" />
                </Box>
              }
              value={`about`}
            />
            <Tab
              label={
                <Box sx={{ ...styles.centerV }}>
                  <EngineeringIcon fontSize="small" sx={{ mr: "8px" }} />
                  <Trans i18nKey="expertGroups" />
                </Box>
              }
              value="expert-groups"
            />
          </TabList>
        </Box>
        <TabPanel value="about">
          <Box sx={{ p: 4, background: "white", borderRadius: 1 }} mt={2}>
            <Box>
              <About />
            </Box>
            <Box mt={16} borderTop={"1px solid #cfc7c7"} pt={1}>
              <Grid container spacing={4}>
                <Grid item md={4} sm={6} xs={12}>
                  <Typography
                    sx={{ opacity: 0.85 }}
                    fontSize={"1rem"}
                    fontFamily="Roboto"
                    letterSpacing=".05rem"
                  >
                    <Trans i18nKey="signOutOfYourAccount" />
                  </Typography>
                  <SignOut />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </TabPanel>
        <TabPanel value="expert-groups">
          <ExpertGroupsContainer />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

const About = ({ fetchAccount }: any) => {
  const { userInfo, dispatch } = useAuthContext();
  const { service } = useServiceContext();
  const userQueryData = useQuery({
    service: (args, config) => service.getSignedInUser(args, config),
    runOnMount: false,
  });
  const { display_name } = userInfo;
  const dialogProps = useDialog();

  const onSubmit = async () => {
    const res = await userQueryData.query();
    dispatch(authActions.setUserInfo(res));
  };

  const openDialog = () => {
    dialogProps.openDialog({ type: "update", data: userInfo });
  };

  return (
    <Box sx={{ ...styles.centerV }}>
      <Avatar sx={{ width: "64px", height: "64px" }} />
      <Box ml={2}>
        <Typography variant="h6">{display_name}</Typography>
      </Box>
      <IconButton sx={{ ml: "auto" }} onClick={openDialog}>
        <BorderColorRoundedIcon />
      </IconButton>
      <AccountCEFormDialog {...dialogProps} onSubmitForm={onSubmit} />
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

export default AccountContainer;
