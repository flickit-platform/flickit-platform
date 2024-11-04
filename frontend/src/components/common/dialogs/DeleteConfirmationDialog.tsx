import { Trans, useTranslation } from "react-i18next";
import { CEDialog, CEDialogActions } from "./CEDialog";
import { Typography } from "@mui/material";
import { Warning } from "@mui/icons-material";

interface IDeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

export const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
}: IDeleteConfirmationDialogProps) => {
  const { t } = useTranslation();

  return (
    <CEDialog
      open={open}
      onClose={onClose}
      title={
        <>
          <Warning />
          <Trans i18nKey="warning" />
        </>
      }
      maxWidth="sm"
    >
      <Typography sx={{ color: "#0A2342" }}>
        <Trans i18nKey={content} />
      </Typography>
      <CEDialogActions
        type="delete"
        loading={false}
        onClose={onClose}
        submitButtonLabel={t("confirm")}
        onSubmit={onConfirm}
      />
    </CEDialog>
  );
};
