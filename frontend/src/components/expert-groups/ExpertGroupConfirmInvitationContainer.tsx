import { LoadingButton } from "@mui/lab";
import { Box, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { styles } from "../../config/styles";
import { useAuthContext } from "../../providers/AuthProvider";
import { useServiceContext } from "../../providers/ServiceProvider";
import { ICustomError } from "../../utils/CustomError";
import toastError from "../../utils/toastError";
import { useQuery } from "../../utils/useQuery";
import QueryData from "../shared/QueryData";
import Title from "../shared/Title";
import ExpertGroupsItem from "./ExpertGroupsItem";

const ExpertGroupConfirmInvitationContainer = () => {
  const { service } = useServiceContext();
  const { expertGroupId, token } = useParams();
  const { userInfo } = useAuthContext();
  const { id } = userInfo;
  const navigate = useNavigate();
  const expertGroupQueryData = useQuery({
    service: (args = { id: expertGroupId }, config) => service.fetchUserExpertGroup(args, config),
  });
  const confirmInvitationQueryData = useQuery({
    service: (args = { token }, config) => service.confirmExpertGroupInvitation(args, config),
    runOnMount: false,
  });

  const confirmInvitation = async () => {
    try {
      await confirmInvitationQueryData.query();
      navigate(`/account/${id}/expert-groups/${expertGroupId}`, { replace: true });
      toast.success("You have joined this expert group successfully.");
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  return (
    <QueryData
      {...expertGroupQueryData}
      render={(data) => {
        return (
          <Box sx={{ maxWidth: { xs: "100%", sm: "90%", md: "60%", lg: "40%" }, m: "auto" }}>
            <Title size="small">You have been invited to this group. do you want to accept this invitation?</Title>
            <Box my={3}>
              <ExpertGroupsItem data={data} disableActions={true} />
            </Box>
            <Box>
              <LoadingButton
                sx={{ mr: 1 }}
                loading={confirmInvitationQueryData.loading}
                variant="contained"
                onClick={confirmInvitation}
              >
                Accept
              </LoadingButton>
              <LoadingButton loading={confirmInvitationQueryData.loading}>Reject</LoadingButton>
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default ExpertGroupConfirmInvitationContainer;
