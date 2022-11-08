import React from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { Title } from "../../../components";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { SpaceMembers } from "../SpaceMembers";
import { useQuery } from "../../../utils/useQuery";
import { useServiceContext } from "../../../providers/ServiceProvider";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { useAuthContext } from "../../../providers/AuthProvider";
import { AccessLevel } from "../../../components/AccessLevel";
import { styles } from "../../../config/styles";

export const SpaceSettingContainer = () => {
  const { spaceId = "" } = useParams();
  const { service } = useServiceContext();
  const { userInfo } = useAuthContext();
  const userId = userInfo?.id;
  const { loading, data = {} } = useQuery({
    service: () => service.fetchSpace(spaceId),
  });
  const { title } = data;
  const isOwner = userId == data?.owner?.id;

  return (
    <Box maxWidth="1440px" m="auto">
      <Title sup="spaces" backLink={"/spaces"}>
        <Box sx={{ ...styles.centerV, opacity: 0.9 }}>
          {loading ? (
            <Skeleton variant="rounded" width="110px" sx={{ mr: 1 }} />
          ) : (
            title
          )}{" "}
          <Trans i18nKey="setting" />
        </Box>
      </Title>
      <Box pt={3}>
        {!loading && <SpaceSettings isOwner={isOwner} data={data} />}
      </Box>
    </Box>
  );
};

export default function SpaceSettings(props: any) {
  const { isOwner, data = {} } = props;
  const { members_number } = data;
  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            <Tab
              label={
                <Box sx={{ ...styles.centerV }}>
                  <GroupsRoundedIcon fontSize="small" sx={{ mr: "8px" }} />
                  <Trans i18nKey="members" />
                </Box>
              }
              value="1"
            />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ p: { xs: 1, sm: 3 } }}>
          <AccessLevel hasAccess={isOwner}>
            <SpaceMembers members_number={members_number} />
          </AccessLevel>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
