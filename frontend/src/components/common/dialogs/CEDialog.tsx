import React, { PropsWithChildren } from "react";
import { styles } from "@styles";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import useScreenResize from "@utils/useScreenResize";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions, { DialogActionsProps } from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import { TDialogContextType } from "@types";
import { t } from "i18next";

interface ICEDialogProps extends Omit<DialogProps, "title"> {
  closeDialog?: () => void;
  title: JSX.Element;
}

export const CEDialog = (props: PropsWithChildren<ICEDialogProps>) => {
  const { closeDialog, title, children, ...rest } = props;
  const fullScreen = useScreenResize("sm");

  return (
    <Dialog
      onClose={closeDialog}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      {...rest}
    >
      <DialogTitle textTransform={"uppercase"} sx={{ ...styles.centerV }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

interface ICEDialogActionsProps extends PropsWithChildren<DialogActionsProps> {
  loading: boolean;
  closeDialog?: () => void;
  onClose?: () => void;
  type: (string & {}) | TDialogContextType | undefined;
  submitButtonLabel?: string;
  submitAndViewButtonLabel?: string;
  hasViewBtn?: boolean;
  hideSubmitButton?: boolean;
  onSubmit?: (e: any, shouldView?: boolean) => any;
  onBack?: () => void;
  hasBackBtn?: boolean;
  cancelLabel?: string
}

export const CEDialogActions = (props: ICEDialogActionsProps) => {
  const {
    type,
    loading,
    closeDialog,
    onClose = closeDialog,
    onSubmit,
    onBack,
    hasBackBtn,
    hasViewBtn,
    hideSubmitButton = false,
    submitButtonLabel = type === "update" ? t("update") : t("create"),
    cancelLabel = "cancel",
    submitAndViewButtonLabel,
    children,
  } = props;
  const fullScreen = useScreenResize("sm");
  if (!onClose) {
    throw new Error("onClose or closeDialog not provided for CEDialogActions");
  }
  return (
    <DialogActions
      sx={{
        marginTop: fullScreen ? "auto" : 4,
      }}
    >
      <Grid container spacing={2} justifyContent="flex-end">
        <Grid item>
          <Button onClick={onClose} data-cy="cancel">
            <Trans i18nKey={cancelLabel} />
          </Button>
        </Grid>
        {hasBackBtn && (
          <Grid item>
            <Button data-cy="back" variant="contained" onClick={onBack}>
              <Trans i18nKey="back" />
            </Button>
          </Grid>
        )}
        {!hideSubmitButton && (
          <Grid item>
            <LoadingButton
              type="submit"
              data-cy="submit"
              variant="contained"
              loading={loading}
              onClick={(e: any) => {
                e.preventDefault();
                onSubmit?.(e)?.();
              }}
            >
              <Trans i18nKey={submitButtonLabel as string} />
            </LoadingButton>
          </Grid>
        )}
        {hasViewBtn && (
          <Grid item>
            <LoadingButton
              type="submit"
              variant="contained"
              color="success"
              loading={loading}
              data-cy="submit-and-view"
              onClick={(e: any) => {
                e.preventDefault();
                onSubmit?.(e, true)();
              }}
            >
              {submitAndViewButtonLabel ?? (
                <Trans i18nKey={`${submitButtonLabel} ${t("andView")}`} />
              )}
            </LoadingButton>
          </Grid>
        )}
        {children && (
          <Grid item>
            {children}
          </Grid>
        )}
      </Grid>
    </DialogActions>
  );
};
