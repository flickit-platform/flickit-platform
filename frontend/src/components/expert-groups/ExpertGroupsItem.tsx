import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Link as MLink,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Link } from "react-router-dom";
import { styles } from "@styles";
import useMenu from "@utils/useMenu";
import MoreActions from "@common/MoreActions";
import { useQueryDataContext } from "@common/QueryData";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { Trans } from "react-i18next";
import useDialog from "@utils/useDialog";
import ExpertGroupCEFormDialog from "./ExpertGroupCEFormDialog";
import { useAuthContext } from "@providers/AuthProvider";
import Tooltip from "@mui/material/Tooltip";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import React, {useState} from "react";

interface IExpertGroupsItemProps {
  data: any;
  disableActions?: boolean;
}

const ExpertGroupsItem = (props: IExpertGroupsItemProps) => {
  const { data, disableActions = false } = props;
  const {
    id,
    title,
    bio = "",
    picture,
    membersCount,
    members = [],
    publishedKitsCount,
    editable,
  } = data || {};
  const { service } = useServiceContext();
  const seenExpertGroupQuery = useQuery({
    service: (args, config) => service.seenExpertGroup({ id }, config),
    runOnMount: false,
    toastError: false,
  });
  const seenExpertGroup = async () => {
    try {
      await seenExpertGroupQuery.query();
    } catch (e) {
      const err = e as ICustomError;
      if (err.response?.data && err.response?.data.hasOwnProperty("message")) {
        if (Array.isArray(err.response?.data?.message)) {
          toastError(err.response?.data?.message[0]);
        } else {
          toastError(err);
        }
      }
    }
  };
  return (
    <Box>
      <Card>
        <CardHeader
          onClick={seenExpertGroup}
          titleTypographyProps={{
            component: Link,
            to: `/user/expert-groups/${id}`,
            sx: { textDecoration: "none" },
          }}
          avatar={
            <Avatar
                component={Link}
                to={`${id}`}
                sx={(() => {
                  return {
                    bgcolor: (t) => t.palette.grey[800],
                    textDecoration: "none",
                    width: 50,height: 50
                  };
                })()}
                src={picture}
            >
              {title?.[0]?.toUpperCase()}
            </Avatar>
          }
          action={
            !disableActions && (
              <Actions
                editable={editable}
                expertGroup={data}
              />
            )
          }
          title={
            <Box component={"b"} color="GrayText" fontSize=".95rem">
              {title}
            </Box>
          }
          subheader={
            <Box sx={{ ...styles.centerCV, textTransform: "lowercase" }}>
              <Trans i18nKey="publishedAssessmentKits" />: {publishedKitsCount}
              <Box></Box>
            </Box>
          }
        />
        <CardContent
          sx={{
            height: "48px",
            padding: 0,
            margin: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "calc(100% - 16px)",
            whiteSpace: "pre-wrap",
            display: "-webkit-box",
            webkitBoxOrient: "vertical",
            webkitLineClamp: "2",
          }}
        >
          {bio}
        </CardContent>
        <Divider sx={{ mx: 2 }} />
        <CardActions disableSpacing>
          <AvatarGroup
            total={membersCount}
            max={5}
            sx={{ mx: 0.5 }}
            slotProps={{
              additionalAvatar: {
                sx: { width: 28, height: 28, fontSize: ".75rem" },
              },
            }}
          >
            {members.map((user: any,index:number) => {
              return (
                <Tooltip key={index} title={user?.displayName}>
                  <>
                  <Avatar
                    key={user.id}
                    sx={{ width: 28, height: 28, fontSize: ".8rem" }}
                    alt={user.displayName}
                    title={user.displayName}
                  >
                    {user?.displayName.split("")[0].toUpperCase()}
                  </Avatar>
                  </>
                </Tooltip>
              );
            })}
          </AvatarGroup>
        </CardActions>
      </Card>
    </Box>
  );
};

const Actions = (props: any) => {
  const { expertGroup, editable } = props;
  const { query: fetchExpertGroups } = useQueryDataContext();
  const { userInfo } = useAuthContext();
  const { service } = useServiceContext();
  const { id } = expertGroup;
  const { query: fetchExpertGroup, loading } = useQuery({
    service: (args = { id }, config) =>
      service.fetchUserExpertGroup(args, config),
    runOnMount: false,
  });
  const deleteExpertGroupQuery = useQuery({
    service: (args, config) => service.deleteExpertGroup({ id }, config),
    runOnMount: false,
    toastError: false,
  });
  const dialogProps = useDialog();

  const openEditDialog = async (e: any) => {
    const data = await fetchExpertGroup();
    dialogProps.openDialog({
      data,
      type: "update",
    });
  };
  const deleteExpertGroup = async () => {
    try {
      await deleteExpertGroupQuery.query();
      await fetchExpertGroups();
    } catch (e) {
      const err = e as ICustomError;
      if (err.response?.data && err.response?.data.hasOwnProperty("message")) {
        if (Array.isArray(err.response?.data?.message)) {
          toastError(err.response?.data?.message[0]);
        } else {
          toastError(err);
        }
      }
    }
  };

  return editable ? (
    <>
      <MoreActions
        {...useMenu()}
        boxProps={{ ml: 0.2 }}
        loading={loading}
        items={[
          {
            icon: <EditRoundedIcon fontSize="small" />,
            text: <Trans i18nKey="edit" />,
            onClick: openEditDialog,
          },
          {
            icon: <DeleteRoundedIcon fontSize="small" />,
            text: <Trans i18nKey="delete" />,
            onClick: deleteExpertGroup,
          },
        ]}
      />
      <ExpertGroupCEFormDialog
        {...dialogProps}
        onSubmitForm={fetchExpertGroups}
      />
    </>
  ) : null;
};

export default ExpertGroupsItem;
