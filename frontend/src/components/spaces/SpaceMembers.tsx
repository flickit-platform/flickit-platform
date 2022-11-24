import Box from "@mui/material/Box";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Title from "../../components/shared/Title";
import QueryData from "../../components/shared/QueryData";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Avatar from "@mui/material/Avatar";
import useMenu from "../../utils/useMenu";
import { Trans } from "react-i18next";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { t } from "i18next";
import { LoadingButton } from "@mui/lab";
import { authActions, useAuthContext } from "../../providers/AuthProvider";
import { Chip, Skeleton, Typography } from "@mui/material";
import { toast } from "react-toastify";
import MoreActions from "../../components/shared/MoreActions";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import toastError from "../../utils/toastError";
import useScreenResize from "../../utils/useScreenResize";
import { styles } from "../../config/styles";
import { IMemberModel } from "../../types";

export const SpaceMembers = () => {
  const { spaceId = "" } = useParams();
  const { service } = useServiceContext();
  const { dispatch, userInfo } = useAuthContext();
  const userId = userInfo?.id;
  const user_id_ref = useRef<HTMLInputElement>(null);
  const spaceData = useQuery<IMemberModel>({
    service: (args, config) => service.fetchSpaceMembers({ spaceId }, config),
  });
  const {
    query: addMember,
    loading,
    data,
  } = useQuery({
    service: (
      { id = spaceId, value = user_id_ref.current?.value }: any,
      config
    ) => service.addMember({ spaceId: id, user_id: value }, config),
    runOnMount: false,
    toastError: (err) => {
      if (err?.data?.user_id?.[0]) {
        toast.error(err.data?.user_id[0]);
      } else if (
        Array.isArray(err?.data) &&
        typeof err?.data?.[0] === "string"
      ) {
        toast.error(err?.data?.[0]);
      } else {
        toastError(err);
      }
    },
  });

  useEffect(() => {
    let controller: AbortController;
    if (data?.id) {
      controller = new AbortController();
      spaceData.query();
      user_id_ref.current?.form?.reset();
      service
        .getSignedInUser(undefined, { signal: controller.signal })
        .then(({ data }) => {
          dispatch(authActions.setUserInfo(data));
        })
        .catch((e) => {});
    }
    return () => {
      controller?.abort();
    };
  }, [data]);

  return (
    <Box mt={1}>
      <Box>
        <Title
          size="small"
          fontSize={"1rem"}
          fontFamily="RobotoMedium"
          textTransform={"unset"}
          letterSpacing=".05rem"
          mb={2}
        >
          <Trans i18nKey="addNewMember" />
        </Title>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!user_id_ref.current?.value) {
              toast.error(t("pleaseEnterEmailAddress") as string);
            } else
              addMember({ id: spaceId, value: user_id_ref.current?.value });
          }}
        >
          <TextField
            fullWidth
            type={"email"}
            size="small"
            variant="outlined"
            inputRef={user_id_ref}
            placeholder={t("enterEmailOfTheUserYouWantToAdd")}
            label={<Trans i18nKey="userEmail" />}
            InputProps={{
              endAdornment: <AddMemberButton loading={loading} />,
            }}
          />
        </form>
      </Box>
      <Box mt={6}>
        <Title
          size="small"
          mb={2}
          fontSize={"1rem"}
          fontFamily="RobotoMedium"
          textTransform={"capitalize"}
          letterSpacing=".05rem"
          toolbar={
            <Box sx={{ ...styles.centerV, opacity: 0.8, mb: "auto" }}>
              <PeopleOutlineRoundedIcon sx={{ mr: 0.5 }} fontSize="small" />
              <Typography fontFamily={"RobotoBold"}>
                {spaceData?.data?.results?.length}
              </Typography>
            </Box>
          }
        >
          <Trans i18nKey="members" />
        </Title>
        <QueryData
          {...spaceData}
          renderLoading={() => {
            return (
              <>
                {[1, 2, 3, 4, 5].map((item) => {
                  return (
                    <Skeleton
                      key={item}
                      variant="rectangular"
                      sx={{ borderRadius: 2, height: "50px", mb: 1 }}
                    />
                  );
                })}
              </>
            );
          }}
          render={(data) => {
            const { results } = data;

            return (
              <>
                {results.map((member: any) => {
                  const { user = {}, id } = member;
                  const name =
                    user.first_name && user.last_name
                      ? user.first_name + " " + user.last_name
                      : user.username;
                  const isOwner = userId == user?.id;

                  return (
                    <Box
                      key={id}
                      sx={{
                        ...styles.centerV,
                        boxShadow: (t) =>
                          `0 5px 8px -8px ${t.palette.grey[400]}`,
                        borderRadius: 2,
                        pb: 0.4,
                        mb: 2,
                      }}
                    >
                      <Box sx={{ ...styles.centerV }}>
                        <Box>
                          <Avatar sx={{ width: 34, height: 34 }}>
                            <PersonRoundedIcon />
                          </Avatar>
                        </Box>
                        <Box ml={2}>{name}</Box>
                      </Box>
                      <Box ml="auto" sx={{ ...styles.centerV }}>
                        {isOwner && (
                          <Chip
                            label={<Trans i18nKey="owner" />}
                            size="small"
                            sx={{ mr: 1.5 }}
                          />
                        )}
                        {
                          <Actions
                            isOwner={isOwner}
                            member={member}
                            fetchSpaceMembers={spaceData.query}
                          />
                        }
                      </Box>
                    </Box>
                  );
                })}
              </>
            );
          }}
        />
      </Box>
    </Box>
  );
};

const AddMemberButton = ({ loading }: { loading: boolean }) => {
  const isSmallScreen = useScreenResize("sm");

  return (
    <InputAdornment position="end">
      <LoadingButton
        sx={{
          mr: "-10px",
          minWidth: "10px",
          p: isSmallScreen ? 0.5 : undefined,
        }}
        startIcon={isSmallScreen ? undefined : <AddRoundedIcon />}
        loading={loading}
        type="submit"
        variant="contained"
        size="small"
      >
        {isSmallScreen ? (
          <AddRoundedIcon fontSize="small" />
        ) : (
          <Trans i18nKey={"addMember"} />
        )}
      </LoadingButton>
    </InputAdornment>
  );
};

const Actions = (props: any) => {
  const { member, fetchSpaceMembers } = props;
  const { spaceId = "" } = useParams();
  const { service } = useServiceContext();
  const { query: deleteSpaceMember, loading } = useQuery({
    service: (arg, config) =>
      service.deleteSpaceMember({ spaceId, memberId: member.id }, config),
    runOnMount: false,
    toastError: true,
  });

  const deleteItem = async (e: any) => {
    await deleteSpaceMember();
    await fetchSpaceMembers();
  };

  return (
    <MoreActions
      {...useMenu()}
      loading={loading}
      items={[
        {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="delete" />,
          onClick: deleteItem,
        },
      ]}
    />
  );
};
