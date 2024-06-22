import { SyntheticEvent, useEffect, useState } from "react";
import { styles } from "@styles";
import { Trans } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { authActions, useAuthContext } from "@providers/AuthProvider";
//-------------- mui imports
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";
import TabContext from "@mui/lab/TabContext";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import UserAccount from "./UserAccount";
import UserExpertGroups from "./UserExpertGroups";

const UserContainer = () => {
  const { accountTab } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(accountTab as string);

  useEffect(() => {
    if (!["account", "expert-groups"].includes(accountTab as string)) {
      navigate(`/user/account`, { replace: true });
      setValue("account");
    }
  }, []);

  useEffect(() => {
    if (accountTab && accountTab !== value) {
      setValue(accountTab);
    }
  }, [accountTab]);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(`/user/${newValue}`);
  };

  return (
    <Box m="auto">
      <Box>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box>
              <TabList onChange={handleChange} scrollButtons="auto" variant="scrollable">
                <Tab
                  label={
                    <Box sx={{ ...styles.centerV }}>
                      <AccountBoxRoundedIcon fontSize="small" sx={{ mr: "8px" }} />
                      <Trans i18nKey="account" />
                    </Box>
                  }
                  value={`account`}
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
            <TabPanel value="account">
              <Box mt={2}>
                <Box>
                  <UserAccount />
                </Box>
                {/* <Box mt={16} borderTop={"1px solid #cfc7c7"} pt={1}>
              <Grid container spacing={4}>
                <Grid item md={4} sm={6} xs={12}>
                  <Typography
                    sx={{ opacity: 0.85 }}
                    fontSize={"1rem"}
                    letterSpacing=".05rem"
                  >
                    <Trans i18nKey="signOutOfYourAccount" />
                  </Typography>
                  <SignOut />
                </Grid>
              </Grid>
            </Box> */}
              </Box>
            </TabPanel>
            <TabPanel value="expert-groups">
              <UserExpertGroups />
            </TabPanel>
          </TabContext>
        </Box>
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

export default UserContainer;
