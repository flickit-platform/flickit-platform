import React, { useEffect, useRef, useState } from "react";
import { authActions, useAuthContext } from "../../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { styles } from "../../config/styles";
import { InputFieldUC } from "../shared/fields/InputField";
import Title from "../shared/Title";
import { Trans } from "react-i18next";
import { Box } from "@mui/material";
import {
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { LoadingButton } from "@mui/lab";
import LinearProgress from "@mui/material/LinearProgress";
import { useServiceContext } from "../../providers/ServiceProvider";
import { ICustomError } from "../../utils/CustomError";
import setServerFieldErrors from "../../utils/setServerFieldError";
import { toast } from "react-toastify";
import toastError from "../../utils/toastError";
import Alert from "@mui/material/Alert";
import { Typography } from "@mui/material";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";

const SignUp = () => {
  const { dispatch, isAuthenticatedUser } = useAuthContext();
  const { service } = useServiceContext();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const successfullyCreatedAccount = useRef(false);
  const abortController = useRef(new AbortController());

  const formMethods = useForm({ shouldUnregister: true });

  useEffect(() => {
    if (isAuthenticatedUser) {
      navigate("/", { replace: true });
    }
    return () => {
      abortController.current.abort();
    };
  }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const result = await service.signUp(
        {
          ...data,
          re_password: data.password,
        },
        { signal: abortController.current.signal }
      );

      setLoading(false);
      successfullyCreatedAccount.current = true;
      toast.success(<Trans i18nKey={"yourAccountCreatedSuccessfully"} />);
    } catch (e) {
      const err = e as ICustomError;
      setServerFieldErrors(err, formMethods);
      setLoading(false);
      toastError(err);
      successfullyCreatedAccount.current = false;
    }
  };

  return !isAuthenticatedUser ? (
    successfullyCreatedAccount.current ? (
      <SuccessfullyCreatedAccountMessage />
    ) : (
      <Paper sx={styles.cards.auth}>
        <Title alignSelf={"stretch"} borderBottom>
          <Trans i18nKey="signUpScreenTitle" />
        </Title>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2} sx={styles.formGrid}>
              <Grid item xs={12}>
                <InputFieldUC
                  autoFocus={true}
                  autoComplete={"off"}
                  name="first_name"
                  label={<Trans i18nKey="firstName" />}
                />
              </Grid>
              <Grid item xs={12}>
                <InputFieldUC
                  autoComplete={"off"}
                  name="last_name"
                  label={<Trans i18nKey="lastName" />}
                />
              </Grid>
              <Grid item xs={12}>
                <InputFieldUC
                  name="username"
                  autoComplete="off"
                  required={true}
                  label={<Trans i18nKey="username" />}
                />
              </Grid>
              <Grid item xs={12}>
                <InputFieldUC
                  type="email"
                  autoComplete={"off"}
                  required={true}
                  name="email"
                  label={<Trans i18nKey="email" />}
                />
              </Grid>
              <Grid item xs={12} sx={{ position: "relative" }}>
                <InputFieldPassword formMethods={formMethods} />
              </Grid>
              <Grid item xs={12} sx={{ mt: { xs: 4, md: 15 } }}>
                <LoadingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  loading={loading}
                >
                  <Trans i18nKey="signUp" />
                </LoadingButton>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
            <Box pt={1}>
              <Trans i18nKey="haveAccount" />{" "}
              <Button
                onClick={() => {
                  navigate("/sign-in");
                }}
              >
                <Trans i18nKey="signIn" />
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Paper>
    )
  ) : null;
};

const InputFieldPassword = (props: {
  formMethods: UseFormReturn<FieldValues, any>;
}) => {
  const { formMethods } = props;
  const { control } = formMethods;
  const value = useWatch({ control, name: "password" });
  const [progress, setProgress] = useState(0);
  const capsCountRef = useRef(0);
  const smallCountRef = useRef(0);
  const numberCountRef = useRef(0);
  const symbolCountRef = useRef(0);

  useEffect(() => {
    const capsCount = (value?.match(/[A-Z]/g) || [])?.length;
    const smallCount = (value?.match(/[a-z]/g) || [])?.length;
    const numberCount = (value?.match(/[0-9]/g) || [])?.length;
    const symbolCount = (value?.match(/\W/g) || [])?.length;
    if (value?.length >= 8) {
      if (capsCount >= 1) {
        capsCountRef.current = 25;
      } else {
        capsCountRef.current = 0;
      }
      if (smallCount >= 1) {
        smallCountRef.current = 25;
      } else {
        smallCountRef.current = 0;
      }
      if (numberCount >= 1) {
        numberCountRef.current = 25;
      } else {
        numberCountRef.current = 0;
      }
      if (symbolCount >= 1) {
        symbolCountRef.current = 25;
      } else {
        symbolCountRef.current = 0;
      }
      const totalProgress =
        capsCountRef.current +
        smallCountRef.current +
        numberCountRef.current +
        symbolCountRef.current;
      setProgress(totalProgress);
    } else {
      setProgress(0);
    }
  }, [value]);

  return (
    <>
      <InputFieldUC
        type="password"
        minLength={8}
        required={true}
        autoComplete="off"
        name="password"
        helperText={
          progress >= 25 &&
          progress < 75 && <Trans i18nKey="needStrongPassword" />
        }
        label={<Trans i18nKey="password" />}
      />
      {progress > 0 && (
        <LinearProgress
          variant="determinate"
          value={progress}
          color={
            progress === 25
              ? "error"
              : progress === 50
              ? "warning"
              : progress === 75
              ? "info"
              : "success"
          }
          sx={{
            height: 2,
            width: "calc(100% - 38px)",
            position: "absolute",
            top: "59px",
            transform: "translateX(10px)",
          }}
        />
      )}
    </>
  );
};

const SuccessfullyCreatedAccountMessage = () => {
  return (
    <Paper sx={styles.cards.auth}>
      <Box display="flex" justifyContent={"center"}>
        <MarkEmailReadRoundedIcon color="success" sx={{ fontSize: "3rem" }} />
      </Box>
      <Box mt={2}>
        <Alert severity="success">
          <Trans i18nKey="youHaveSignedUpSuccessfully" />
        </Alert>

        <Typography
          variant="h6"
          fontFamily="Roboto"
          sx={{ my: 3, textAlign: "center", letterSpacing: ".03em" }}
        >
          <Trans i18nKey="pleaseCheckYouEmail" />
        </Typography>
        <Box display="flex" flexDirection={"column"}>
          <Button
            variant="contained"
            component={"a"}
            href="https://gmail.com"
            target="_blank"
          >
            <Trans i18nKey={"checkYourInbox"} />
          </Button>
          <Button component={Link} to="/sign-in" size="small" sx={{ mt: 2 }}>
            <Trans i18nKey={"clickHereToSignIn"} />
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default SignUp;
