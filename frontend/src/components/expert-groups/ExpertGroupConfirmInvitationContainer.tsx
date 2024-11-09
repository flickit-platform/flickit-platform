import { LoadingButton } from "@mui/lab";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "@providers/AuthProvider";
import { useServiceContext } from "@providers/ServiceProvider";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import { useQuery } from "@utils/useQuery";
import QueryData from "@common/QueryData";
import Title from "@common/Title";
import ExpertGroupsItem from "./ExpertGroupsItem";
import { theme } from "@/config/theme";

const ExpertGroupConfirmInvitationContainer = () => {
  const { service } = useServiceContext();
  const { expertGroupId = "", token } = useParams();
  const { userInfo } = useAuthContext();
  const { id = "" } = userInfo;
  const navigate = useNavigate();
  const expertGroupQueryData = useQuery({
    service: (args = { id: expertGroupId }, config) =>
      service.fetchUserExpertGroup(args, config),
  });
  const confirmInvitationQueryData = useQuery({
    service: (args = { token, expert_group_id: expertGroupId }, config) =>
      service.confirmExpertGroupInvitation(args, config),
    runOnMount: false,
  });

  const confirmInvitation = async () => {
    try {
      await confirmInvitationQueryData.query();
      navigate(`/user/expert-groups/${expertGroupId}`, {
        replace: true,
      });
      toast.success("You have joined this expert group successfully.");
    } catch (e) {
      const err = e as ICustomError;
      if (err?.response?.data?.code === "ALREADY_EXISTS") {
        navigate(`/user/expert-groups/${expertGroupId}`, {
          replace: true,
        });
      } else {
        toastError(err);
      }
    }
  };

  const decline = async () => {
    try {
      await service.deleteExpertGroupMember({id: expertGroupId,userId: id},{})
      navigate("/spaces/1", { replace: true });
    }catch (e){
      const err = e as ICustomError;
      toastError(err);
    }
  };

  return (
    <QueryData
      {...expertGroupQueryData}
      render={(data) => {
        return (
          <Box
            sx={{
              maxWidth: { xs: "100%", sm: "90%", md: "60%", lg: "40%" },
              m: "auto",
            }}
          >
            <Title size="small" textTransform={"none"}>
              <Trans i18nKey="youHaveBeenInvitedToExpertGroup" />
            </Title>
            <Box my={3}>
              <ExpertGroupsItem data={data} disableActions={true} />
            </Box>
            <Box>
              <LoadingButton
                sx={{
                  marginRight: theme.direction === "ltr" ? 1 : "unset",
                  marginLeft: theme.direction === "rtl" ? 1 : "unset",
                }}
                loading={confirmInvitationQueryData.loading}
                variant="contained"
                onClick={confirmInvitation}
              >
                <Trans i18nKey="acceptInvitation" />
              </LoadingButton>
              <LoadingButton
                loading={confirmInvitationQueryData.loading}
                onClick={decline}
              >
                <Trans i18nKey="decline" />
              </LoadingButton>
            </Box>
          </Box>
        );
      }}
    />
  );
};

export default ExpertGroupConfirmInvitationContainer;
