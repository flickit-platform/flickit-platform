import React, { useRef } from "react";
import {
  Box,
  Divider,
  InputAdornment,
  Link as MLink,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Title from "@common/Title";
import { useServiceContext } from "@providers/ServiceProvider";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import QueryBatchData from "@common/QueryBatchData";
import { Trans } from "react-i18next";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import { t } from "i18next";
import setDocumentTitle from "@utils/setDocumentTitle";
import toastError from "@utils/toastError";
import { ICustomError } from "@utils/CustomError";
import { useConfigContext } from "@/providers/ConfgProvider";
import SettingBox from "@common/settingBox";
import Grid from "@mui/material/Grid";
import {styles} from "@styles";

const AssessmentKitPermissionsContainer = () => {
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();
  const assessmentKitUsersListQueryData = useQuery({
    service: (args = { assessmentKitId: assessmentKitId }, config) =>
      service.assessmentKitUsersList(args, config),
  });
  const assessmentKitMinInfoQueryData = useQuery({
    service: (args = { assessmentKitId: assessmentKitId }, config) =>
      service.assessmentKitMinInfo(args, config),
  });

  const { config } = useConfigContext();
  return (
    <QueryBatchData
      queryBatchData={[
        assessmentKitUsersListQueryData,
        assessmentKitMinInfoQueryData,
      ]}
      render={([data = {}, info = {}]) => {
        setDocumentTitle(
          `${t("assessmentKit")}: ${info?.expertGroup?.title || ""}`,
          config.appTitle,
        );
        return (
          <AssessmentKitPermisson
            data={data}
            query={assessmentKitUsersListQueryData}
            info={info}
          />
        );
      }}
    />
  );
};

const AssessmentKitPermisson = (props: any) => {
  const { data, query, info } = props;
  const { items } = data;
  const { id, title, expertGroup } = info;
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();
  const deleteMemberToKitPermissionQueryData = useQuery({
    service: (args, config) =>
      service.deleteMemberToKitPermission(args, config),
    runOnMount: false,
  });
  const deleteMember = async (id: any) => {
    try {
      await deleteMemberToKitPermissionQueryData.query({
        assessmentKitId: assessmentKitId,
        userId: id,
      });
      await query.query();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  return (
      <Box m="auto" pb={3} sx={{ px: { xl: 30, lg: 18, xs: 2, sm: 3 } }}>
      <Title
        inPageLink="assessmentKitPermissons"
        size="small"
        sup={
          <SupTitleBreadcrumb
            routes={[
              {
                title: t("expertGroups") as string,
                to: `/user/expert-groups`,
              },
              {
                title: expertGroup.title,
                to: `/user/expert-groups/${expertGroup.id} `,
              },
              {
                title: title,
                to: `/user/expert-groups/${expertGroup.id}/assessment-kits/${id}`,
              },
              {
                title: "permissions",
                to: `/user/expert-groups/${expertGroup.id}/assessment-kits/${id}/permissions`,
              },
            ]}
          />
        }
      >
          <Grid container columns={12} mb={5}>
              <Grid item sm={12} xs={12}>
                  <Box
                      sx={{ ...styles.centerV }}
                      gap={2}
                      justifyContent="flex-start"
                  >
                      <Typography
                          color="primary"
                          textAlign="left"
                          variant="headlineLarge"
                      >
                          <Trans
                              i18nKey={"assessmentKitPermissons"}
                              values={{ assessmentKit: title }}
                          />
                      </Typography>
                  </Box>
              </Grid>
          </Grid>
      </Title>
        <SettingBox title={"members"} items={items} queryData={query}  deleteMember={deleteMember} />
    </Box>
  );
};

export default AssessmentKitPermissionsContainer;
