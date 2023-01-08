import { Box } from "@mui/material";
import { styles } from "../../config/styles";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import QueryData from "../shared/QueryData";
import forLoopComponent from "../../utils/forLoopComponent";
import { LoadingSkeleton } from "../shared/loadings/LoadingSkeleton";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import ProfileCEFromDialog from "./ProfileCEFromDialog";
import useDialog from "../../utils/useDialog";
import { TQueryFunction } from "../../types";
import ProfileListItem from "./ProfileListItem";

const ProfilesListContainer = () => {
  const { service } = useServiceContext();
  const profilesQueryData = useQuery({
    service: (args, config) => service.fetchProfiles(args, config),
  });

  return (
    <Box>
      <Box display="flex" mb={1} position="relative">
        <CreateProfileButton onSubmitForm={profilesQueryData.query} />
      </Box>
      <QueryData
        {...profilesQueryData}
        renderLoading={() => (
          <>
            {forLoopComponent(5, (index) => (
              <LoadingSkeleton key={index} sx={{ height: "60px", mb: 1 }} />
            ))}
          </>
        )}
        render={(data) => {
          const { results = [] } = data;
          return (
            <>
              {results.map((profile: any) => {
                return (
                  <ProfileListItem
                    key={profile?.id}
                    data={profile}
                    fetchProfiles={profilesQueryData.query}
                  />
                );
              })}
            </>
          );
        }}
      />
    </Box>
  );
};

const CreateProfileButton = (props: { onSubmitForm: TQueryFunction }) => {
  const { onSubmitForm } = props;
  const dialogProps = useDialog();

  return (
    <>
      <Button
        variant="contained"
        size="small"
        sx={{
          ml: "auto",
          position: { xs: "static", sm: "absolute" },
          right: "-16px",
          top: "-64px",
        }}
        onClick={dialogProps.openDialog}
      >
        <Trans i18nKey="createProfile" />
      </Button>
      <ProfileCEFromDialog {...dialogProps} onSubmitForm={onSubmitForm} />
    </>
  );
};

export default ProfilesListContainer;
