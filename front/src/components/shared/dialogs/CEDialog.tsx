import React, { PropsWithChildren } from "react";
import { styles } from "../../../config/styles";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import useScreenResize from "../../../utils/useScreenResize";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions, { DialogActionsProps } from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";

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

interface ICEDialogActionsProps extends DialogActionsProps {
  loading: boolean;
  closeDialog?: () => void;
  onClose?: () => void;
  type: "update" | "create";
}

export const CEDialogActions = (props: ICEDialogActionsProps) => {
  const { type, loading, closeDialog, onClose = closeDialog } = props;
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
          <LoadingButton type="submit" variant="contained" loading={loading}>
            {type === "update" ? (
              <Trans i18nKey="update" />
            ) : (
              <Trans i18nKey="create" />
            )}
          </LoadingButton>
        </Grid>
        <Grid item>
          <Button onClick={onClose}>
            <Trans i18nKey="cancel" />
          </Button>
        </Grid>
      </Grid>
    </DialogActions>
  );
};
