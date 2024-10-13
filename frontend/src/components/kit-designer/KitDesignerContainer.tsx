import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import KitDesignerTitle from "./KitDesignerContainerTitle";
import { Trans } from "react-i18next";

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
        <Grid container sm={12} xs={12} mt={2} sx={{ height: '100%' }}>
          <Grid item sm={3} xs={12} sx={{ height: '100%' }}>
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
                height: '100%',
                minHeight: '400px',
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
                }}
                label={<Trans i18nKey="maturityLevels" />} />
              <Tab sx={{
                alignItems: "flex-start",
              }}
                label={<Trans i18nKey="subjects" />} />
              <Tab sx={{
                alignItems: "flex-start",
              }}
                label={<Trans i18nKey="attributes" />} />
              <Tab sx={{
                alignItems: "flex-start",
              }}
                label={<Trans i18nKey="questionnaires" />} />
              {/* Add more tabs as needed */}
            </Tabs>
          </Grid>

          <Grid item sm={9} xs={12} sx={{ height: '100%' }}>
            {selectedTab === 0 && (
              <Typography><Trans i18nKey="maturityLevelsContent" /></Typography>
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
