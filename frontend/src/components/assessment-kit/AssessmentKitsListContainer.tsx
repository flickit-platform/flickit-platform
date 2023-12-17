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
          const { privateKits = [], publicKits = [] } = data;
          const [value, setValue] = useState("public");
          const handleTabChange = (
            event: React.SyntheticEvent,
            newValue: string
          ) => {
            setValue(newValue);
          };

          return (
            <>
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
                  <Box mt={3}>
                    <Grid container spacing={2}>
                      {publicKits.map((assessment_kit: any) => {
                        return (
                          <Grid
                            item
                            xs={12}
                            md={4}
                            lg={3}
                            key={assessment_kit.id}
                          >
                            <AssessmentKitsMarketListItem
                              bg1={"#4568dc"}
                              bg2={"#b06ab3"}
                              data={assessment_kit}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </TabPanel>
                <TabPanel value="private">
                  <Box mt={3}>
                    <Grid container spacing={2}>
                      {privateKits.map((assessment_kit: any) => {
                        return (
                          <Grid
                            item
                            xs={12}
                            md={4}
                            lg={3}
                            key={assessment_kit.id}
                          >
                            <AssessmentKitsMarketListItem
                              bg1={"#4568dc"}
                              bg2={"#b06ab3"}
                              data={assessment_kit}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </TabPanel>
              </TabContext>
            </>
          );
        }}
      />
    </Box>
  );
};

export default AssessmentKitsListContainer;
