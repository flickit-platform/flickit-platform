import useScreenResize from "@utils/useScreenResize";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { Trans } from "react-i18next";
import { DialogTitle } from "@mui/material";
import { Warning } from "@mui/icons-material";
import { styles } from "@styles";
import { theme } from "@/config/theme";

const ConfirmRemoveMemberDialog = (props: any) => {
  const {
    expandedRemoveDialog,
    onCloseRemoveDialog,
    assessmentId,
    assessmentName,
    fetchAssessmentsUserListRoles,
    setChangeData,
    inviteesMemberList,
  } = props;

  const { service } = useServiceContext();

  const deleteUserRole = useQuery({
    service: (args, config) =>
      service.deleteUserRole({ assessmentId, args }, config),
    runOnMount: false,
  });

  const RemoveMembersInvitees = useQuery({
    service: (args = { invitedId: "" }, config) =>
      service.RemoveAssessmentMembersInvitees(args, config),
    runOnMount: false,
  });

  const DeletePerson = async () => {
    try {
      if (expandedRemoveDialog.invited) {
        const invitedId = expandedRemoveDialog.id;
        await RemoveMembersInvitees.query({ invitedId });
        await inviteesMemberList.query();
        onCloseRemoveDialog();
      } else {
        await deleteUserRole.query(expandedRemoveDialog?.id);
        onCloseRemoveDialog();
        setChangeData((prev: boolean) => !prev);
        // await fetchAssessmentsUserListRoles()
      }
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  return (
    <Dialog
      open={expandedRemoveDialog.display}
      onClose={onCloseRemoveDialog}
      maxWidth={"sm"}
      // fullScreen={fullScreen}
      fullWidth
      sx={{
        ".MuiDialog-paper::-webkit-scrollbar": {
          display: "none",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
      }}
    >
      <DialogTitle textTransform="uppercase" sx={{ ...styles.centerV }}>
        <>
          <Warning
            sx={{
              marginRight: theme.direction === "ltr" ? 1 : "unset",
              marginLeft: theme.direction === "rtl" ? 1 : "unset",
            }}
          />
          <Trans i18nKey="warning" />
        </>
      </DialogTitle>
      <DialogContent
        sx={{
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          textAlign: "left",
        }}
      >
        <Typography sx={{ color: "#0A2342" }}>
          {expandedRemoveDialog.invited ? (
            <Trans
              i18nKey="areYouSureYouWantDeleteThisMemberInvited"
              values={{
                name: expandedRemoveDialog?.name,
              }}
            />
          ) : (
            <Trans
              i18nKey="areYouSureYouWantDeleteThisMember"
              values={{
                name: expandedRemoveDialog?.name,
                assessment: assessmentName,
              }}
            />
          )}
        </Typography>

        <Box mt={2} alignSelf="flex-end" sx={{ display: "flex", gap: 2 }}>
          <Button onClick={onCloseRemoveDialog}>
            <Trans i18nKey={"cancel"} />
          </Button>
          <Button variant="contained" onClick={DeletePerson}>
            <Trans i18nKey={"confirm"} />
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmRemoveMemberDialog;
