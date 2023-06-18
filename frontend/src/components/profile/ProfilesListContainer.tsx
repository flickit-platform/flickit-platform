import { Box, Grid } from "@mui/material";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import QueryData from "@common/QueryData";
import forLoopComponent from "@utils/forLoopComponent";
import { LoadingSkeleton } from "@common/loadings/LoadingSkeleton";
import ProfilesMarketListItem from "./ProfilesMarketListItem";

const ProfilesListContainer = () => {
  const { service } = useServiceContext();
  const profilesQueryData = useQuery({
    service: (args, config) => service.fetchProfiles(args, config),
  });

  return (
    <Box>
      <QueryData
        {...profilesQueryData}
        renderLoading={() => (
          <>
            <Box mt={`2`}>
              <Grid container spacing={2}>
                {forLoopComponent(5, (index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <LoadingSkeleton
                      key={index}
                      sx={{ height: "340px", mb: 1 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        )}
        render={(data) => {
          const { results = [] } = data;
          return (
            <>
              <Box mt={3}>
                <Grid container spacing={2}>
                  {results.map((profile: any) => {
                    return (
                      <Grid item xs={12} md={6} lg={4} key={profile.id}>
                        <ProfilesMarketListItem
                          bg1={"#4568dc"}
                          bg2={"#b06ab3"}
                          data={profile}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </>
          );
        }}
      />
    </Box>
  );
};

export default ProfilesListContainer;
