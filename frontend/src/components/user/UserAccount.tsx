import { t } from "i18next";
import Title from "@common/Title";
import { Trans } from "react-i18next";
import useDialog from "@utils/useDialog";
import { useQuery } from "@utils/useQuery";
import getUserName from "@utils/getUserName";
import useDocumentTitle from "@utils/useDocumentTitle";
import AccountCEFormDialog from "./UserCEFormDialog";
import { useServiceContext } from "@providers/ServiceProvider";
import { authActions, useAuthContext } from "@providers/AuthProvider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";

const UserAccount = () => {
  const { userInfo, dispatch } = useAuthContext();
  const { service } = useServiceContext();
  const userQueryData = useQuery({
    service: (args, config) => service.getUserProfile(args, config),
    runOnMount: true,
  });
  const { displayName, email, bio, linkedin, pictureLink } = userInfo;
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
            alt={displayName}
            src={pictureLink || "/"}
          />
        </Box>
      </Box>
      <Box ml={"130px"} mt={1}>
        <Title
          textTransform={"capitalize"}
          sub={<Box textTransform={"none"}>{email}</Box>}
          toolbar={
            <>
              <IconButton sx={{ ml: "auto", mb: 1.2, mr: 1.5 }} onClick={openDialog} color="primary" size="small">
                <BorderColorRoundedIcon />
              </IconButton>
              <AccountCEFormDialog {...dialogProps} onSubmitForm={onSubmit} />
            </>
          }
        >
          {displayName}
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
                  <Trans i18nKey="linkedin" />
                </Typography>
                <Typography sx={{ pt: 0.5, fontWeight: "bold" }}>{linkedin}</Typography>
              </Box>
              <Box mt={2.5}>
                <Typography variant="subLarge">
                  <Trans i18nKey="bio" />
                </Typography>
                <Typography sx={{ pt: 0.5, fontWeight: "bold" }}>{bio}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default UserAccount;
