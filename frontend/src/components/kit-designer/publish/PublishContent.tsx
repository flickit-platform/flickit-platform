import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import PermissionControl from "../../common/PermissionControl";
import { Trans, useTranslation } from "react-i18next";
import { useServiceContext } from "@/providers/ServiceProvider";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ICustomError } from "@/utils/CustomError";
import toastError from "@/utils/toastError";
import { IKitVersion } from "@/types";
import { InfoOutlined } from "@mui/icons-material";
import { DeleteConfirmationDialog } from "@/components/common/dialogs/DeleteConfirmationDialog";
import { useState } from "react";
import { Tooltip } from "@mui/material";

const PublishContent = ({ kitVersion }: { kitVersion: IKitVersion }) => {
  const { service } = useServiceContext();
  const { kitVersionId = "", expertGroupId } = useParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handlePublish = async () => {
    try {
      const data = {
        kitVersionId,
      };
      await service.activateKit({ kitVersionId }, data, undefined);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const handleDeleteDraft = async () => {
    try {
      await service.deleteKitVersion({ kitVersionId });
      navigate(`/user/expert-groups/${expertGroupId}/`);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  return (
    <PermissionControl>
      <>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="headlineSmall" fontWeight="bold">
            <Trans i18nKey="release" />
          </Typography>
        </Box>
        <Typography variant="bodyMedium">
          <Trans i18nKey="publishDescription" />
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={8}
        >
          <Box display="flex" gap={2}>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trans i18nKey="deleteDraft" />
            </Button>
            <Tooltip title={<Trans i18nKey="releaseNote" />}>
              <Button
                variant="outlined"
                component={Link}
                to={`/user/expert-groups/${expertGroupId}/`}
              >
                <Trans i18nKey="close" />
              </Button>
            </Tooltip>
          </Box>
          <Button
            variant="contained"
            onClick={handlePublish}
            component={Link}
            to={`/user/expert-groups/${expertGroupId}/assessment-kits/${kitVersion.assessmentKit.id}`}
          >
            <Trans i18nKey="release" />
          </Button>
        </Box>
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteDraft}
          title="warning"
          content="deleteDraftConfirmationMessage"
        />
      </>
    </PermissionControl>
  );
};

export default PublishContent;
