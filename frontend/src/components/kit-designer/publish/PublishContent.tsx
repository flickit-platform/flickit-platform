import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import PermissionControl from "../../common/PermissionControl";
import { Trans } from "react-i18next";
import { useServiceContext } from "@/providers/ServiceProvider";
import { Link, useParams } from "react-router-dom";
import { ICustomError } from "@/utils/CustomError";
import toastError from "@/utils/toastError";
import { IKitVersion } from "@/types";

const PublishContent = ({ kitVersion }: { kitVersion: IKitVersion }) => {
  const { service } = useServiceContext();
  const { kitVersionId = "", expertGroupId } = useParams();
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
  return (
    <PermissionControl>
      <>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {" "}
          <Typography variant="headlineSmall" fontWeight="bold">
            <Trans i18nKey="publish" />
          </Typography>
          <Button
            variant="contained"
            onClick={handlePublish}
            component={Link}
            to={`/user/expert-groups/${expertGroupId}/assessment-kits/${kitVersion.assessmentKit.id}`}
          >
            <Trans i18nKey="publish" />
          </Button>
        </Box>
        <Divider sx={{ my: 1 }} />

        <Typography variant="bodyMedium">
          <Trans i18nKey="publishDescription" />
        </Typography>
      </>
    </PermissionControl>
  );
};

export default PublishContent;
