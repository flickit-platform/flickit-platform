import { Typography, Box } from "@mui/material";
import React, { useState } from "react";
import { Trans } from "react-i18next";
import { styles } from "../../config/styles";
import { useServiceContext } from "../../providers/ServiceProvider";
import { TId, TQueryFunction } from "../../types";
import { ICustomError } from "../../utils/CustomError";
import toastError from "../../utils/toastError";
import useMenu from "../../utils/useMenu";
import { useQuery } from "../../utils/useQuery";
import MoreActions from "../shared/MoreActions";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Link } from "react-router-dom";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import PublishedWithChangesRoundedIcon from "@mui/icons-material/PublishedWithChangesRounded";
import { toast } from "react-toastify";

interface IProfileListItemProps {
  data: {
    id: TId;
    title: string;
  };
  fetchProfiles?: TQueryFunction;
  link?: string;
}

const ProfileListItem = (props: IProfileListItemProps) => {
  const { data, fetchProfiles, link } = props;
  const { id, title } = data || {};
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
            ...styles.centerV,
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
        </Box>

        <Box ml="auto" sx={{ ...styles.centerV, color: "#525252" }} alignSelf="stretch">
          <Actions profile={data} fetchProfiles={fetchProfiles} />
        </Box>
      </Box>
    </Box>
  );
};

const Actions = (props: any) => {
  const { profile, fetchProfiles, dialogProps, setUserInfo } = props;
  const { id, current_user_delete_permission = false, is_active = false } = profile;
  const { service } = useServiceContext();
  const [editLoading, setEditLoading] = useState(false);
  const deleteProfileQuery = useQuery({
    service: (args, config) => service.deleteProfile({ id }, config),
    runOnMount: false,
  });

  const publishProfileQuery = useQuery({
    service: (args, config) => service.publishProfile({ id }, config),
    runOnMount: false,
  });

  const unPublishProfileQuery = useQuery({
    service: (args, config) => service.unPublishProfile({ id }, config),
    runOnMount: false,
  });

  if (!fetchProfiles) {
    console.warn("fetchProfiles not provided. profile list won't be updated on any action");
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
      await deleteProfileQuery.query();
      await fetchProfiles?.();
      await setUserInfo();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const publishProfile = async (e: any) => {
    try {
      const res = await publishProfileQuery.query();
      res.message && toast.success(res.message);
      await fetchProfiles?.();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  const unPublishProfile = async (e: any) => {
    try {
      const res = await unPublishProfileQuery.query();
      res.message && toast.success(res.message);
      await fetchProfiles?.();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  return (
    <MoreActions
      {...useMenu()}
      boxProps={{ ml: 0.2 }}
      loading={deleteProfileQuery.loading || publishProfileQuery.loading || unPublishProfileQuery.loading || editLoading}
      items={[
        is_active
          ? {
              icon: <ArchiveRoundedIcon fontSize="small" />,
              text: <Trans i18nKey="archive" />,
              onClick: unPublishProfile,
            }
          : {
              icon: <PublishedWithChangesRoundedIcon fontSize="small" />,
              text: <Trans i18nKey="publish" />,
              onClick: publishProfile,
            },

        current_user_delete_permission && {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="delete" />,
          onClick: deleteItem,
        },
      ]}
    />
  );
};

export default ProfileListItem;
