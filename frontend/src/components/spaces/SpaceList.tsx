import React, { useEffect, useState } from "react";
import { Chip, CircularProgress, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { authActions, useAuthContext } from "@providers/AuthProvider";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import useMenu from "@utils/useMenu";
import IconButton from "@mui/material/IconButton";
import { ICustomError } from "@utils/CustomError";
import toastError from "@utils/toastError";
import MoreActions from "@common/MoreActions";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import { styles } from "@styles";
import { TDialogProps } from "@utils/useDialog";
import { ISpaceModel, ISpacesModel, TQueryFunction } from "@types";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

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
  const { id: userId } = userInfo;
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
      <Box minWidth="440px">
        {results.map((item: any) => {
          const isOwner = userId == item?.owner.id;
          return (
            <SpaceCard
              key={item?.id}
              item={item}
              isActiveSpace={false}
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
  const { loading, abortController } = useQuery({
    service: (args, config) => service.setCurrentSpace({ spaceId: id }, config),
    runOnMount: false,
    toastError: true,
  });
  const { dispatch } = useAuthContext();
  const {
    title,
    id,
    members_number = 0,
    assessment_numbers = 0,
    is_default_space_for_current_user,
  } = item || {};
  const changeCurrentSpaceAndNavigateToAssessments = async (e: any) => {
    e.preventDefault();
    service
      .getSignedInUser(undefined, { signal: abortController.signal })
      .then(({ data }) => {
        dispatch(authActions.setUserInfo(data));
        navigate(`/${id}/assessments/1`);
      })
      .catch((e) => {});
  };
  const is_farsi = localStorage.getItem("lang") === "fa" ? true : false;
  return (
    <Box
      sx={{
        ...styles.centerV,
        boxShadow: (t) => `0 5px 8px -8px ${t.palette.grey[400]}`,
        borderRadius: 2,
        px: 1,
        py: 1,
        mb: 1,
        backgroundColor: "white",
      }}
      data-cy="space-card"
    >
      <Box sx={{ ...styles.centerV }} alignSelf="stretch">
        <Box sx={{ ...styles.centerV }} alignSelf="stretch">
          <Typography
            component={Link}
            variant="h6"
            fontFamily={"Roboto"}
            to={`/${id}/assessments/1`}
            data-cy="space-card-link"
            onClick={changeCurrentSpaceAndNavigateToAssessments}
            sx={{
              fontSize: { xs: "1.05rem", sm: "1.1rem", md: "1.2rem" },
              fontWeight: "bold",
              textDecoration: "none",
              height: "100%",
              display: "flex",
              alignItems: "center",
              alignSelf: "stretch",
              px: 2,
              color: (t) => t.palette.primary.dark,
            }}
          >
            {loading ? <CircularProgress size="20px" /> : <>{title}</>}
          </Typography>
          {isOwner && (
            <Chip
              sx={{
                mr: `${is_farsi ? 0 : "8px"}`,
                ml: `${is_farsi ? "8px" : 0}`,
                opacity: 0.7,
              }}
              label={<Trans i18nKey={"owner"} />}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </Box>
      <Box
        ml={`${is_farsi ? 0 : "auto"}`}
        mr={`${is_farsi ? "auto" : 0}`}
        sx={{ ...styles.centerV,flexDirection:`${is_farsi ? "row-reverse" : "row"}` }}
      >
        <Box sx={{ ...styles.centerV, opacity: 0.8 }}>
          <PeopleOutlineRoundedIcon
            sx={{
              mr: `${is_farsi ? 0 : "4px"}`,
              ml: `${is_farsi ? "4px" : 0}`,
            }}
            fontSize="small"
          />
          <Typography fontFamily="Roboto" fontWeight={"bold"}>
            {members_number}
          </Typography>
        </Box>
        <Box
          sx={{
            ...styles.centerV,
            opacity: 0.8,
            mr: `${is_farsi ? 0 : "32px"}`,
            ml: `${is_farsi ? "32px" : 0}`,
          }}
        >
          <DescriptionRoundedIcon
            sx={{
              mr: `${is_farsi ? 0 : "4px"}`,
              ml: `${is_farsi ? "4px" : 0}`,
              opacity: 0.8,
            }}
            fontSize="small"
          />
          <Typography fontFamily="Roboto" fontWeight={"bold"}>
            {assessment_numbers}
          </Typography>
        </Box>
      </Box>
      <Box
        justifyContent={"flex-end"}
        sx={{ ...styles.centerV, minWidth: { xs: "170px", sm: "220px" } }}
      >
        {isActiveSpace && (
          <Box
            sx={{
              mr: `${is_farsi ? 0 : "8px"}`,
              ml: `${is_farsi ? "8px" : 0}`,
            }}
          >
            <Chip
              label={<Trans i18nKey={"current"} />}
              color="info"
              size="small"
            />
          </Box>
        )}
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
            isOwner={isOwner}
            is_default_space_for_current_user={
              is_default_space_for_current_user
            }
          />
        </>
      </Box>
    </Box>
  );
};

const Actions = (props: any) => {
  const {
    space,
    fetchSpaces,
    dialogProps,
    isActiveSpace,
    setUserInfo,
    isOwner,
    is_default_space_for_current_user,
  } = props;
  const { id: spaceId } = space;
  const { service } = useServiceContext();
  const { userInfo } = useAuthContext();
  const { default_space } = userInfo;
  const [editLoading, setEditLoading] = useState(false);
  const {
    query: deleteSpaceMember,
    loading,
    abortController,
  } = useQuery({
    service: (args, config) => service.deleteSpace({ spaceId }, config),
    runOnMount: false,
  });
  const leaveSpaceQuery = useQuery({
    service: (args, config) => service.leaveSpace({ spaceId }, config),
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
  const leaveSpace = async (e: any) => {
    try {
      await leaveSpaceQuery.query();
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
      loading={loading || editLoading || leaveSpaceQuery.loading}
      items={[
        isOwner && {
          icon: <EditRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="edit" />,
          onClick: openEditDialog,
        },
        !is_default_space_for_current_user && {
          icon: <ExitToAppRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="leaveSpace" />,
          onClick: leaveSpace,
        },
      ]}
    />
  );
};

export { SpacesList };
