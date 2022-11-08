import React from "react";
import { authActions, useAuthContext } from "../../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { styles } from "../../../config/styles";
import { InputFieldUC, Title } from "../../../components";
import { Trans } from "react-i18next";
import Box from "@mui/material/Box";
import { FormProvider, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { LoadingButton } from "@mui/lab";
import { useServiceContext } from "../../../providers/ServiceProvider";
import Alert from "@mui/material/Alert";
import { ICustomError } from "../../../utils/CustomError";
import toastError from "../../../utils/toastError";

const SignIn = () => {
  const { dispatch, isAuthenticatedUser } = useAuthContext();
  const { service } = useServiceContext();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const formMethods = useForm({ shouldUnregister: true });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { data: res } = await service.signIn(data);
      setLoading(false);
      dispatch(authActions.signIn(res));
    } catch (e) {
      const err = e as ICustomError;
      setLoading(false);
      if (err?.data?.detail) {
        formMethods.setError("username", { type: "value" });
        formMethods.setError("password", {
          type: "value",
          message: err?.data?.detail,
        });
      }
      toastError(err, { filterIfHasData: false });
    }
  };

  return !isAuthenticatedUser ? (
    <Paper sx={styles.cards.auth}>
      <Title alignSelf={"stretch"} borderBottom>
        <Trans i18nKey="signInScreenTitle" />
      </Title>

      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={styles.formGrid}>
            <Grid item xs={12}>
              <InputFieldUC
                autoFocus={true}
                name="username"
                required={true}
                label={<Trans i18nKey="username" />}
              />
            </Grid>
            <Grid item xs={12}>
              <InputFieldUC
                name="password"
                type="password"
                required={true}
                label={<Trans i18nKey="password" />}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: { xs: 6, md: 20 } }}>
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                loading={loading}
              >
                <Trans i18nKey="signIn" />
              </LoadingButton>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
          <Box pt={1}>
            <Trans i18nKey="dontHaveAccount" />{" "}
            <Button
              onClick={() => {
                navigate("/sign-up");
              }}
            >
              <Trans i18nKey="signUp" />
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Paper>
  ) : null;
};

export { SignIn };
