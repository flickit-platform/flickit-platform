import React, { useEffect, useState } from "react";
import { Chip, CircularProgress, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { authActions, useAuthContext } from "../../providers/AuthProvider";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import useMenu from "../../utils/useMenu";
import IconButton from "@mui/material/IconButton";
import { ICustomError } from "../../utils/CustomError";
import toastError from "../../utils/toastError";
import MoreActions from "../../components/shared/MoreActions";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import { styles } from "../../config/styles";
import { TDialogProps } from "../../utils/useDialog";
import { ISpaceModel, ISpacesModel, TQueryFunction } from "../../types";

interface ISpaceListProps {
  dialogProps: TDialogProps;
  data: ISpacesModel;
  fetchSpaces: TQueryFunction<ISpacesModel>;
}

const SpacesList = (props: ISpaceListProps) => {
  const { dialogProps, data, fetchSpaces } = props;
  const { service } = useServiceContext();
  const { dispatch } = useAuthContext();
  const { userInfo } = useAuthContext();
  const { id: userId, current_space } = userInfo;

  const setUserInfo = (signal: AbortSignal) => {
    service
      .getSignedInUser(undefined, { signal })
      .then(({ data }) => {
        dispatch(authActions.setUserInfo(data));
      })
      .catch((e) => {
        const err = e as ICustomError;
        toastError(err);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    setUserInfo(controller.signal);
    return () => {
      controller?.abort();
    };
  }, []);

  const { results = [] } = data || {};

  return (
    <Box sx={{ overflowX: "auto", py: 1 }}>
      <Box mt={4} minWidth="440px">
        {results.map((item: any) => {
          const isActiveSpace = current_space?.id == item?.id;
          const isOwner = userId == item?.owner.id;
          return (
            <SpaceCard
              key={item?.id}
              item={item}
              isActiveSpace={isActiveSpace}
              isOwner={isOwner}
              dialogProps={dialogProps}
              fetchSpaces={fetchSpaces}
              setUserInfo={setUserInfo}
            />
          );
        })}
      </Box>
    </Box>
  );
};

interface ISpaceCardProps {
  item: ISpaceModel;
  isActiveSpace: boolean;
  isOwner: boolean;
  dialogProps: TDialogProps;
  fetchSpaces: TQueryFunction<ISpacesModel>;
  setUserInfo: (signal: AbortSignal) => void;
}

const SpaceCard = (props: ISpaceCardProps) => {
  const {
    item,
    isActiveSpace,
    dialogProps,
    fetchSpaces,
    isOwner,
    setUserInfo,
  } = props;
  const { service } = useServiceContext();
  const navigate = useNavigate();
  const {
    loading,
    query: setCurrentSpace,
    abortController,
  } = useQuery({
    service: (args, config) => service.setCurrentSpace({ spaceId: id }, config),
    runOnMount: false,
    toastError: true,
  });
  const { dispatch } = useAuthContext();
  const { title, id, members_number = 0 } = item || {};

  const changeCurrentSpaceAndNavigateToAssessments = async (e: any) => {
    e.preventDefault();
    await setCurrentSpace();
    service
      .getSignedInUser(undefined, { signal: abortController.signal })
      .then(({ data }) => {
        dispatch(authActions.setUserInfo(data));
        navigate(`/${id}/assessments`);
      })
      .catch((e) => {});
  };

  return (
    <Box
      sx={{
        ...styles.centerV,
        boxShadow: (t) => `0 5px 8px -8px ${t.palette.grey[400]}`,
        borderRadius: 2,
        pb: 1,
        pt: 1,
        mb: 1,
      }}
    >
      <Box sx={{ ...styles.centerV }} alignSelf="stretch">
        <Box sx={{ ...styles.centerV }} alignSelf="stretch">
          <Typography
            component={Link}
            variant="h6"
            fontFamily={"RobotoBold"}
            to={`/${id}/assessments`}
            onClick={changeCurrentSpaceAndNavigateToAssessments}
            sx={{
              fontSize: { xs: "1.05rem", sm: "1.1rem", md: "1.2rem" },
              fontWeight: "bold",
              textDecoration: "none",
              height: "100%",
              display: "flex",
              alignItems: "center",
              alignSelf: "stretch",
              pl: 2,
              pr: { xs: 0.5, sm: 2 },
              color: (t) => t.palette.primary.dark,
            }}
          >
            {loading ? <CircularProgress size="20px" /> : <>{title}</>}
          </Typography>
          {isOwner && (
            <Chip
              sx={{ ml: 1, opacity: 0.7 }}
              label={<Trans i18nKey={"owner"} />}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </Box>
      <Box ml="auto" sx={{ ...styles.centerV }}>
        <Box sx={{ ...styles.centerV, opacity: 0.8 }}>
          <PeopleOutlineRoundedIcon sx={{ mr: 0.5 }} fontSize="small" />
          <Typography fontFamily={"RobotoBold"}>{members_number}</Typography>
        </Box>
      </Box>
      <Box
        justifyContent={"flex-end"}
        sx={{ ...styles.centerV, minWidth: { xs: "170px", sm: "220px" } }}
      >
        {isActiveSpace && (
          <Box mr={1}>
            <Chip
              label={<Trans i18nKey={"current"} />}
              color="info"
              size="small"
            />
          </Box>
        )}
        {isOwner && (
          <>
            <Box sx={{ ...styles.centerV }}>
              <IconButton size="small" component={Link} to={`/${id}/setting`}>
                <SettingsRoundedIcon />
              </IconButton>
            </Box>
            <Actions
              isActiveSpace={isActiveSpace}
              dialogProps={dialogProps}
              space={item}
              fetchSpaces={fetchSpaces}
              setUserInfo={setUserInfo}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

const Actions = (props: any) => {
  const { space, fetchSpaces, dialogProps, isActiveSpace, setUserInfo } = props;
  const { id: spaceId } = space;
  const { service } = useServiceContext();
  const [editLoading, setEditLoading] = useState(false);
  const {
    query: deleteSpaceMember,
    loading,
    abortController,
  } = useQuery({
    service: (args, config) => service.deleteSpace({ spaceId }, config),
    runOnMount: false,
  });

  const openEditDialog = (e: any) => {
    setEditLoading(true);
    service
      .fetchSpace({ spaceId }, { signal: abortController.signal })
      .then(({ data }) => {
        setEditLoading(false);
        dialogProps.openDialog({ data, type: "update" });
      })
      .catch((e) => {
        const err = e as ICustomError;
        toastError(err);
        setEditLoading(false);
      });
  };

  const deleteItem = async (e: any) => {
    try {
      await deleteSpaceMember();
      await fetchSpaces();
      await setUserInfo();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };

  return (
    <MoreActions
      {...useMenu()}
      boxProps={{ ml: 0.2 }}
      loading={loading || editLoading}
      items={[
        {
          icon: <EditRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="edit" />,
          onClick: openEditDialog,
        },
        // !isActiveSpace
        //   ? {
        //       icon: <DeleteRoundedIcon fontSize="small" />,
        //       text: <Trans i18nKey="delete" />,
        //       onClick: deleteItem,
        //     }
        //   : undefined,
      ]}
    />
  );
};

export { SpacesList };
