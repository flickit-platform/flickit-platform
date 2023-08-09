import { Typography, Box, Chip } from "@mui/material";
import React, { useState } from "react";
import { Trans } from "react-i18next";
import { styles } from "@styles";
import { useServiceContext } from "@providers/ServiceProvider";
import { TId, TQueryFunction } from "@types";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import useMenu from "@utils/useMenu";
import { useQuery } from "@utils/useQuery";
import MoreActions from "@common/MoreActions";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Link } from "react-router-dom";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import PublishedWithChangesRoundedIcon from "@mui/icons-material/PublishedWithChangesRounded";
import { toast } from "react-toastify";
import formatDate from "@utils/formatDate";

interface IAssessmentKitListItemProps {
  data: {
    id: TId;
    title: string;
    last_modification_date: string;
    is_active: boolean;
  };
  fetchAssessmentKits?: TQueryFunction;
  fetchUnpublishedAssessmentKits?: TQueryFunction;
  link?: string;
  hasAccess?: boolean;
  is_member?: boolean;
  is_active?: boolean;
}

const AssessmentKitListItem = (props: IAssessmentKitListItemProps) => {
  const {
    data,
    fetchAssessmentKits,
    fetchUnpublishedAssessmentKits,
    link,
    hasAccess,
    is_member,
    is_active,
  } = props;
  const { id, title, last_modification_date } = data || {};
  return (
    <Box
      sx={{
        ...styles.centerV,
        boxShadow: (t) => `0 5px 8px -8px ${t.palette.grey[400]}`,
        borderRadius: 2,
        p: 2,
        backgroundColor: "#fbf8fb",
        mb: 1,
      }}
    >
      <Box sx={{ ...styles.centerV, flex: 1 }} alignSelf="stretch">
        <Box
          sx={{
            ...styles.centerCV,

            textDecoration: "none",
            color: (t) => t.palette.primary.dark,
          }}
          alignSelf="stretch"
          component={Link}
          to={link || `${id}`}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: {
                xs: "1.05rem",
                sm: "1.1rem",
                md: "1.2rem",
                fontFamily: "Roboto",
              },
              fontWeight: "bold",
              textDecoration: "none",
              height: "100%",
              display: "flex",
              alignItems: "center",
              alignSelf: "stretch",
            }}
          >
            {title}
          </Typography>
          <Typography color="GrayText" variant="body2">
            <Trans i18nKey="lastUpdated" /> {formatDate(last_modification_date)}
          </Typography>
        </Box>

        <Box
          ml="auto"
          sx={{ ...styles.centerV, color: "#525252" }}
          alignSelf="stretch"
        >
          {is_active ? (
            <Chip
              label={<Trans i18nKey="published" />}
              color="success"
              size="small"
            />
          ) : (
            <Chip label={<Trans i18nKey="unPublished" />} size="small" />
          )}
          <Actions
            assessment_kit={data}
            fetchAssessmentKits={fetchAssessmentKits}
            hasAccess={hasAccess}
            is_member={is_member}
            is_active={is_active}
          />
        </Box>
      </Box>
    </Box>
  );
};

const Actions = (props: any) => {
  const {
    assessment_kit,
    fetchAssessmentKits,
    dialogProps,
    setUserInfo,
    hasAccess,
    is_member,
    is_active
  } = props;
  const {
    id,
    current_user_delete_permission = false,
  } = assessment_kit;
  const { service } = useServiceContext();
  const [editLoading, setEditLoading] = useState(false);
  const deleteAssessmentKitQuery = useQuery({
    service: (args, config) => service.deleteAssessmentKit({ id }, config),
    runOnMount: false,
  });

  const publishAssessmentKitQuery = useQuery({
    service: (args, config) => service.publishAssessmentKit({ id }, config),
    runOnMount: false,
  });

  const unPublishAssessmentKitQuery = useQuery({
    service: (args, config) => service.unPublishAssessmentKit({ id }, config),
    runOnMount: false,
  });

  if (!fetchAssessmentKits) {
    console.warn(
      "fetchAssessmentKits not provided. assessment kit list won't be updated on any action"
    );
  }

  // const openEditDialog = (e: any) => {
  //   setEditLoading(true);
  //   service
  //     .fetchSpace({ spaceId }, { signal: abortController.signal })
  //     .then(({ data }) => {
  //       setEditLoading(false);
  //       dialogProps.openDialog({ data, type: "update" });
  //     })
  //     .catch((e) => {
  //       const err = e as ICustomError;
  //       toastError(err);
  //       setEditLoading(false);
  //     });
  // };

  const deleteItem = async (e: any) => {
    try {
      await deleteAssessmentKitQuery.query();
      await fetchAssessmentKits?.();
      // await setUserInfo();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const publishAssessmentKit = async (e: any) => {
    try {
      const res = await publishAssessmentKitQuery.query();
      res.message && toast.success(res.message);
      await fetchAssessmentKits?.();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const unPublishAssessmentKit = async (e: any) => {
    try {
      const res = await unPublishAssessmentKitQuery.query();
      res.message && toast.success(res.message);
      await fetchAssessmentKits();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  return hasAccess ? (
    <MoreActions
      {...useMenu()}
      boxProps={{ ml: 0.4 }}
      loading={
        deleteAssessmentKitQuery.loading ||
        publishAssessmentKitQuery.loading ||
        unPublishAssessmentKitQuery.loading ||
        editLoading
      }
      items={[
        is_active
          ? {
              icon: <ArchiveRoundedIcon fontSize="small" />,
              text: <Trans i18nKey="archive" />,
              onClick: unPublishAssessmentKit,
            }
          : {
              icon: <PublishedWithChangesRoundedIcon fontSize="small" />,
              text: <Trans i18nKey="publish" />,
              onClick: publishAssessmentKit,
            },

        is_member && {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="delete" />,
          onClick: deleteItem,
        },
      ]}
    />
  ) : null;
};

export default AssessmentKitListItem;
