import { useState } from "react";
import { Box, Grid } from "@mui/material";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import QueryData from "@common/QueryData";
import forLoopComponent from "@utils/forLoopComponent";
import { LoadingSkeleton } from "@common/loadings/LoadingSkeleton";
import AssessmentKitsMarketListItem from "./AssessmentKitsMarketListItem";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { Trans } from "react-i18next";
const AssessmentKitsListContainer = () => {
  const { service } = useServiceContext();
  const [value, setValue] = useState("public");
  const publicAssessmentKitsQueryData = useQuery({
    service: (args = { isPrivate: false  }, config) =>
      service.fetchAssessmentKits(args, config),
  });
  const privateAssessmentKitsQueryData = useQuery({
    service: (args = { isPrivate: true  }, config) =>
      service.fetchAssessmentKits(args, config),
  });
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Box>
      <TabContext value={value}>
        <Box>
          <TabList onChange={handleTabChange}>
            <Tab
              label={
                <Box sx={{ ...styles.centerV }}>
                  <Trans i18nKey="public" />
                </Box>
              }
              value="public"
            />
            <Tab
              label={
                <Box sx={{ ...styles.centerV }}>
                  <Trans i18nKey="private" />
                </Box>
              }
              value="private"
            />
          </TabList>
        </Box>
        <TabPanel value="public">
          <QueryData
            {...publicAssessmentKitsQueryData}
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
              const { items = [] } = data;
              return (
                <Box mt={3}>
                  <Grid container spacing={2}>
                    {items.map((assessmentKit: any) => {
                      return (
                        <Grid
                          item
                          xs={12}
                          md={4}
                          lg={3}
                          key={assessmentKit.id}
                        >
                          <AssessmentKitsMarketListItem
                            bg1={"#4568dc"}
                            bg2={"#b06ab3"}
                            data={assessmentKit}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              );
            }}
          />
        </TabPanel>
        <TabPanel value="private">
          <QueryData
            {...privateAssessmentKitsQueryData}
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
              const { items = [] } = data;
              return (
                <Box mt={3}>
                  <Grid container spacing={2}>
                    {items.map((assessmentKit: any) => {
                      return (
                        <Grid
                          item
                          xs={12}
                          md={4}
                          lg={3}
                          key={assessmentKit.id}
                        >
                          <AssessmentKitsMarketListItem
                            bg1={"#4568dc"}
                            bg2={"#b06ab3"}
                            data={assessmentKit}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              );
            }}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default AssessmentKitsListContainer;
