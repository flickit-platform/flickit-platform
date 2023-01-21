import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Grid } from "@mui/material";
import { PropsWithChildren } from "react";
import { Trans } from "react-i18next";
import { styles } from "../../../config/styles";
import useScreenResize from "../../../utils/useScreenResize";

interface ICEDialogProps extends Omit<DialogProps, "title"> {
  closeDialog?: () => void;
  title?: JSX.Element;
  inviteButtonLabel?: string;
  loading?: boolean;
  onInvite: (...args: any) => any;
}

const InviteMemberDialog = (props: PropsWithChildren<ICEDialogProps>) => {
  const {
    closeDialog,
    title = <Trans i18nKey="inviteMember" />,
    children,
    inviteButtonLabel = "invite",
    onInvite,
    loading,
    ...rest
  } = props;
  const fullScreen = useScreenResize("sm");

  return (
    <Dialog onClose={closeDialog} fullWidth maxWidth="md" fullScreen={fullScreen} {...rest}>
      <DialogTitle textTransform={"uppercase"} sx={{ ...styles.centerV }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column" }}>{children}</DialogContent>
      <DialogActions
        sx={{
          marginTop: fullScreen ? "auto" : 4,
        }}
      >
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
              onClick={(e: any) => {
                e.preventDefault();
                onInvite?.(e);
              }}
            >
              <Trans i18nKey={inviteButtonLabel as string} />
            </LoadingButton>
          </Grid>
          <Grid item>
            <Button onClick={closeDialog}>
              <Trans i18nKey="cancel" />
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default InviteMemberDialog;
