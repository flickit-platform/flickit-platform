import React from "react";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { styles } from "../../config/styles";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import { useAuthContext } from "../../providers/AuthProvider";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import CircularProgress from "@mui/material/CircularProgress";
import QueryData from "../shared/QueryData";

const AccountActivationSuccessful = () => {
  const { isAuthenticatedUser } = useAuthContext();
  const { uid = "", token = "" } = useParams();
  const { service } = useServiceContext();

  const userActivationQueryData = useQuery({
    service: (args, config) => service.activateUser({ uid, token }, config),
    toastError: true,
  });

  return !isAuthenticatedUser ? (
    <Paper sx={styles.cards.auth}>
      <QueryData
        {...userActivationQueryData}
        renderLoading={() => <CircularProgress />}
        render={() => {
          return (
            <>
              <Box display="flex" justifyContent={"center"}>
                <TaskAltRoundedIcon color="success" sx={{ fontSize: "3rem" }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  fontFamily="Roboto"
                  sx={{ my: 3, textAlign: "center", letterSpacing: ".03em" }}
                >
                  <Trans i18nKey="youHaveVerifiedYourAccount" />
                </Typography>
                <Box display="flex" flexDirection={"column"} pt={3}>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/sign-in"
                    replace={true}
                  >
                    <Trans i18nKey={"clickHereToSignIn"} />
                  </Button>
                </Box>
              </Box>
            </>
          );
        }}
      />
    </Paper>
  ) : null;
};

export default AccountActivationSuccessful;
