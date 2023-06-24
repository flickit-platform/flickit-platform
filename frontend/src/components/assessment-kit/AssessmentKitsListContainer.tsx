import { Box, Grid } from "@mui/material";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import QueryData from "@common/QueryData";
import forLoopComponent from "@utils/forLoopComponent";
import { LoadingSkeleton } from "@common/loadings/LoadingSkeleton";
import AssessmentKitsMarketListItem from "./AssessmentKitsMarketListItem";

const AssessmentKitsListContainer = () => {
  const { service } = useServiceContext();
  const assessmentKitsQueryData = useQuery({
    service: (args, config) => service.fetchAssessmentKits(args, config),
  });

  return (
    <Box>
      <QueryData
        {...assessmentKitsQueryData}
        renderLoading={() => (
          <>
            <Box mt={`2`}>
              <Grid container spacing={2}>
                {forLoopComponent(5, (index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <LoadingSkeleton key={index} sx={{ height: "340px", mb: 1 }} />
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
                  {results.map((assessment_kit: any) => {
                    return (
                      <Grid item xs={12} md={6} lg={4} key={assessment_kit.id}>
                        <AssessmentKitsMarketListItem bg1={"#4568dc"} bg2={"#b06ab3"} data={assessment_kit} />
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

export default AssessmentKitsListContainer;
