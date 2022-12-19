import React, { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Title from "../shared/Title";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import { styles } from "../../config/styles";
import { useParams } from "react-router-dom";
import ProfilesListContainer from "./ProfilesListContainer";
import ProfilesMarketContainer from "./ProfilesMarketContainer";

const ProfilesContainer = (props: PropsWithChildren<{}>) => {
  const [value, setValue] = React.useState("list");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Title>
        <Trans i18nKey="profile" />
      </Title>

      <Box mt={2}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange}>
              <Tab
                label={
                  <Box sx={{ ...styles.centerV }}>
                    <Trans i18nKey="profiles" />
                  </Box>
                }
                value="list"
              />
              <Tab
                label={
                  <Box sx={{ ...styles.centerV }}>
                    <Trans i18nKey="market" />
                  </Box>
                }
                value="market"
              />
            </TabList>
          </Box>
          <TabPanel value="list" sx={{ p: { xs: 1, sm: 3 } }}>
            <ProfilesListContainer />
          </TabPanel>
          <TabPanel value="market" sx={{ p: { xs: 1, sm: 3 } }}>
            <ProfilesMarketContainer />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};

export default ProfilesContainer;
