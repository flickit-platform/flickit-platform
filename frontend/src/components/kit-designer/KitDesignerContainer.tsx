import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import KitDesignerTitle from "./KitDesignerContainerTitle";
import { Trans } from "react-i18next";
import MaturityLevelsContent from "./maturityLevels/MaturityLevelsContent";
import SubjectsContent from "./subjects/SubjectsContent";
import PublishContent from "./publish/PublishContent";
import { useServiceContext } from "@/providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@/utils/useQuery";
import { IKitVersion } from "@/types";
import QuestionnairesContent from "@components/kit-designer/questionnaires/QuestionnairesContent";

const KitDesignerContainer = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { service } = useServiceContext();
  const { kitVersionId = "" } = useParams();

  const handleTabChange = (event: any, newValue: any) => {
    setSelectedTab(newValue);
  };

  const kitVersion = useQuery<IKitVersion>({
    service: (args = { kitVersionId }, config) =>
      service.loadKitVersion(args, config),
  });

  useEffect(() => {
    kitVersion.query();
  }, []);

  return (
    <Box m="auto" pb={3} sx={{ px: { xl: 30, lg: 12, xs: 2, sm: 3 } }}>
      <KitDesignerTitle kitVersion={kitVersion.data} />
      <Grid container spacing={1} columns={12}>
        <Grid item sm={12} xs={12} mt={1}>
          <Typography color="primary" textAlign="left" variant="headlineLarge">
            <Trans i18nKey="kitDesigner" />
          </Typography>
        </Grid>
        <Grid container sm={12} xs={12} mt={6}>
          <Grid
            item
            sm={3}
            xs={12}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Tabs
              textColor="primary"
              indicatorColor="primary"
              orientation="vertical"
              variant="scrollable"
              value={selectedTab}
              onChange={handleTabChange}
              aria-label="Vertical tabs"
              sx={{
                borderRight: 1,
                borderColor: "divider",
                flexGrow: 1,
                backgroundColor: "rgba(36, 102, 168, 0.04)",
                padding: 0,
                color: "rgba(0, 0, 0, 0.6)", // Default text color

                // Adding hover state for background color and text color
                "&:hover": {
                  // backgroundColor: "#f0f0f0",
                  // color: "#2466A8",
                },
                "& .Mui-selected": {
                  color: "#2466A8 !important",
                  fontWeight: "bold",
                  // background: "rgba(36, 102, 168, 0.08)"
                },

                "& .MuiTabs-indicator": {
                  backgroundColor: "primary.main",
                },
              }}
            >
              <Tab
                sx={{
                  alignItems: "flex-start",
                  textTransform: "none",
                }}
                label={
                  <Typography variant="semiBoldLarge">
                    <Trans i18nKey="maturityLevels" />
                  </Typography>
                }
              />
              <Tab
                sx={{
                  alignItems: "flex-start",
                  textTransform: "none",
                }}
                label={
                  <Typography variant="semiBoldLarge">
                    <Trans i18nKey="subjects" />
                  </Typography>
                }
              />
              <Tab
                disabled
                sx={{
                  alignItems: "flex-start",
                  textTransform: "none",
                }}
                label={
                  <Typography variant="semiBoldLarge">
                    <Trans i18nKey="attributes" />
                  </Typography>
                }
              />
              <Tab
                sx={{
                  alignItems: "flex-start",
                  textTransform: "none",
                }}
                label={
                  <Typography variant="semiBoldLarge">
                    <Trans i18nKey="questionnaires" />
                  </Typography>
                }
              />{" "}
              <Tab
                disabled
                sx={{
                  alignItems: "flex-start",
                  textTransform: "none",
                }}
                label={
                  <Typography variant="semiBoldLarge">
                    <Trans i18nKey="questionnairesAndImpacts" />
                  </Typography>
                }
              />
              <Tab
                sx={{
                  alignItems: "flex-start",
                  textTransform: "none",
                }}
                label={
                  <Typography variant="semiBoldLarge">
                    <Trans i18nKey="publish" />
                  </Typography>
                }
              />
            </Tabs>
          </Grid>

          <Grid
            item
            sm={9}
            xs={12}
            sx={{ height: "100%", padding: 3, background: "white" }}
          >
            {selectedTab === 0 && <MaturityLevelsContent />}
            {selectedTab === 1 && <SubjectsContent/>}
            {selectedTab === 2 && (
              <Typography>
                <Trans i18nKey="attributesContent" />
              </Typography>
            )}
            {selectedTab === 3 && <QuestionnairesContent />}
            {selectedTab === 4 && (
              <Typography>
                <Trans i18nKey="questionnairesContent" />
              </Typography>
            )}{" "}
            {/*{selectedTab === 5 && (*/}
            {/*  <Typography>*/}
            {/*    <Trans i18nKey="questionnairesContent" />*/}
            {/*  </Typography>*/}
            {/*)}*/}
            {selectedTab === 5 && <PublishContent />}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default KitDesignerContainer;
