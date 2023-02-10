import React, { useEffect, useLayoutEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { Trans } from "react-i18next";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { authActions, useAuthContext } from "../../providers/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import { styles } from "../../config/styles";
import ExpertGroupsContainer from "../expert-groups/ExpertGroupsContainer";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import AccountCEFormDialog from "./AccountCEFormDialog";
import useDialog from "../../utils/useDialog";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import getUserName from "../../utils/getUserName";
import useDocumentTitle from "../../utils/useDocumentTitle";
import { t } from "i18next";
import Title from "../shared/Title";

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
          <Box mt={2}>
            <Box>
              <About />
            </Box>
            {/* <Box mt={16} borderTop={"1px solid #cfc7c7"} pt={1}>
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
            </Box> */}
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
  const { display_name, email } = userInfo;
  const dialogProps = useDialog();
  useDocumentTitle(`${t("userProfileT")}: ${getUserName(userInfo)}`);

  const onSubmit = async () => {
    const res = await userQueryData.query();
    dispatch(authActions.setUserInfo(res));
  };

  const openDialog = () => {
    dialogProps.openDialog({ type: "update", data: userInfo });
  };

  return (
    <Box>
      <Box
        height={"200px"}
        width="100%"
        sx={{
          borderRadius: "80px 6px 6px 6px",
          background: "linear-gradient(145deg, #efaa9d, #ccf7f9)",
        }}
      >
        <Box position={"relative"} top="168px" left="24px">
          <Avatar
            sx={{
              width: "94px",
              height: "94px",
              border: "4px solid whitesmoke",
            }}
          />
        </Box>
      </Box>
      <Box ml={"130px"} mt={1}>
        <Title
          textTransform={"capitalize"}
          sub={<Box textTransform={"none"}>{email}</Box>}
          toolbar={
            <>
              <IconButton
                sx={{ ml: "auto", mb: 1.2, mr: 1.5 }}
                onClick={openDialog}
                color="primary"
                size="small"
              >
                <BorderColorRoundedIcon />
              </IconButton>
              <AccountCEFormDialog {...dialogProps} onSubmitForm={onSubmit} />
            </>
          }
        >
          {display_name}
        </Title>
      </Box>
      <Box mt={8}>
        <Box borderTop={"1px solid #d1d1d1"} px={1} py={3} m={1}>
          <Grid container spacing={3}>
            <Grid item md={3}>
              <Title size="small" textTransform={"none"}>
                <Trans i18nKey="about" />
              </Title>
            </Grid>
            <Grid item md={9}>
              <Box>
                <Typography variant="subLarge">
                  <Trans i18nKey="emailAddress" />
                </Typography>
                <Typography sx={{ pt: 0.5, fontWeight: "bold" }}>
                  {email}
                </Typography>
              </Box>
              <Box mt={2.5}>
                <Typography variant="subLarge">
                  <Trans i18nKey="accessLevel" />
                </Typography>
                <Typography sx={{ pt: 0.5, fontWeight: "bold" }}>
                  Expert
                </Typography>
              </Box>
              <Box mt={2.5}>
                <Typography variant="subLarge">
                  <Trans i18nKey="bio" />
                </Typography>
                <Typography sx={{ pt: 0.5, fontWeight: "bold" }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Consectetur, dolor atque delectus quibusdam expedita
                  architecto pariatur quos hic mollitia cupiditate
                  necessitatibus eius tempora in, accusantium incidunt illo
                  minus voluptatem aliquam!
                </Typography>
              </Box>
            </Grid>
          </Grid>
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

export default AccountContainer;
