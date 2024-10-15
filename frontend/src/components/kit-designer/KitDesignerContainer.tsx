import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import KitDesignerTitle from "./KitDesignerContainerTitle";
import { Trans } from "react-i18next";
import MaturityLevelsContent from "./MaturityLevelsContent";

const KitDesignerContainer = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: any, newValue: any) => {
    setSelectedTab(newValue);
  };

  return (
    <Box m="auto" pb={3} sx={{ px: { xl: 30, lg: 12, xs: 2, sm: 3 } }}>
      <KitDesignerTitle />
      <Grid container spacing={1} columns={12}>
        <Grid item sm={12} xs={12} mt={1}>
          <Typography color="primary" textAlign="left" variant="headlineLarge">
            <Trans i18nKey="kitDesigner" />
          </Typography>
        </Grid>
        <Grid container sm={12} xs={12} mt={6}>
          <Grid item sm={3} xs={12} sx={{ display: "flex", flexDirection: "column" }}>
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
                borderColor: 'divider',
                flexGrow: 1,
                backgroundColor: 'rgba(36, 102, 168, 0.04)',
                padding: 0,
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                },
              }}
            >
              <Tab
                sx={{
                  alignItems: "flex-start",
                  textTransform: "none",
                }}
                label={<Typography variant="semiBoldLarge"><Trans i18nKey="maturityLevels" /></Typography>} />
              <Tab disabled sx={{
                alignItems: "flex-start",
                textTransform: "none",
              }}
                label={<Typography variant="semiBoldLarge"><Trans i18nKey="subjects" /></Typography>} />
              <Tab disabled sx={{
                alignItems: "flex-start",
                textTransform: "none",
              }}
                label={<Typography variant="semiBoldLarge"><Trans i18nKey="attributes" /></Typography>} />
              <Tab disabled sx={{
                alignItems: "flex-start",
                textTransform: "none",
              }}
                label={<Typography variant="semiBoldLarge"><Trans i18nKey="questionnaires" /></Typography>} />

              {/* Add more tabs as needed */}
            </Tabs>
          </Grid>

          <Grid item sm={9} xs={12} sx={{ height: '100%', padding: 3, background: "white" }} >
            {selectedTab === 0 && (
              <MaturityLevelsContent />
            )}
            {selectedTab === 1 && (
              <Typography><Trans i18nKey="subjectsContent" /></Typography>
            )}
            {selectedTab === 2 && (
              <Typography><Trans i18nKey="attributesContent" /></Typography>
            )}
            {selectedTab === 3 && (
              <Typography><Trans i18nKey="questionnairesContent" /></Typography>
            )}
          </Grid>
        </Grid>

      </Grid>
    </Box>
  );
};

export default KitDesignerContainer;
