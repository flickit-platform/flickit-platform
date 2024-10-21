import React from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Title from "@common/Title";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { SpaceMembers } from "./SpaceMembers";
import { useQuery } from "@utils/useQuery";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { styles } from "@styles";
import { ISpaceModel } from "@types";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import useDialog from "@utils/useDialog";
import CreateSpaceDialog from "./CreateSpaceDialog";
import LoadingButton from "@mui/lab/LoadingButton";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import { theme } from "@/config/theme";

const SpaceSettingContainer = () => {
  const { spaceId = "" } = useParams();
  const { service } = useServiceContext();
  const { loading, data, query } = useQuery<ISpaceModel>({
    service: (args, config) => service.fetchSpace({ spaceId }, config),
  });

  const { title, editable } = data || {};

  return (
    <Box maxWidth="1440px" m="auto">
      <Title
        size="large"
        sup={
          <SupTitleBreadcrumb
            routes={[
              {
                to: "/spaces/1",
                title: "spaces",
                sup: "spaces",
                // icon: <FolderRoundedIcon fontSize="inherit" sx={{ mr: 0.5 }} />,
              },
            ]}
          />
        }
        toolbar={editable ? <EditSpaceButton fetchSpace={query} /> : <div />}
        backLink={"/"}
      >
        <Box sx={{ ...styles.centerV, opacity: 0.9, unicodeBidi:"plaintext" }}>
          {loading ? (
            <Skeleton
              variant="rounded"
              width="110px"
              sx={{
                marginRight: theme.direction === "ltr" ? 1 : "unset",
                marginLeft: theme.direction === "rtl" ? 1 : "unset",
              }}
            />
          ) : (
            title
          )}{" "}
          <Trans i18nKey="setting" />
        </Box>
      </Title>
      <Box pt={3}>{!loading && <SpaceSettings editable={editable} />}</Box>
    </Box>
  );
};

const EditSpaceButton = (props: any) => {
  const { fetchSpace } = props;
  const { service } = useServiceContext();
  const { spaceId } = useParams();
  const queryData = useQuery({
    service: (args = { spaceId }, config) => service.fetchSpace(args, config),
    runOnMount: false,
  });
  const dialogProps = useDialog();

  const openEditDialog = async (e: any) => {
    const data = await queryData.query();
    dialogProps.openDialog({
      data,
      type: "update",
    });
  };

  return (
    <>
      <LoadingButton
        loading={queryData.loading}
        startIcon={<BorderColorRoundedIcon />}
        size="small"
        onClick={openEditDialog}
      >
        <Trans i18nKey="editSpace" />
      </LoadingButton>
      <CreateSpaceDialog {...dialogProps} onSubmitForm={fetchSpace} />
    </>
  );
};

function SpaceSettings(props: { editable: boolean }) {
  const { editable } = props;

  const [value, setValue] = React.useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const is_farsi = localStorage.getItem("lang") === "fa" ? true : false;
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box>
          <TabList onChange={handleChange}>
            <Tab
              label={
                <Box sx={{ ...styles.centerV }}>
                  <GroupsRoundedIcon
                    fontSize="small"
                    sx={{
                      mr: `${is_farsi ? 0 : "8px"}`,
                      ml: `${is_farsi ? "8px" : 0}`,
                    }}
                  />
                  <Trans i18nKey="members" />
                </Box>
              }
              value="1"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          {/* <ErrorAccessDenied hasAccess={isOwner}> */}
          <SpaceMembers editable={editable} />
          {/* </ErrorAccessDenied> */}
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default SpaceSettingContainer;
