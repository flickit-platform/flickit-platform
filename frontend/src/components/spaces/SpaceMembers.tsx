import Box from "@mui/material/Box";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Title from "@common/Title";
import QueryData from "@common/QueryData";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Avatar from "@mui/material/Avatar";
import useMenu from "@utils/useMenu";
import { Trans } from "react-i18next";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { t } from "i18next";
import { LoadingButton } from "@mui/lab";
import { authActions, useAuthContext } from "@providers/AuthProvider";
import { Chip, Skeleton, Typography } from "@mui/material";
import { toast } from "react-toastify";
import MoreActions from "@common/MoreActions";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import toastError from "@utils/toastError";
import useScreenResize from "@utils/useScreenResize";
import { styles } from "@styles";
import { IDialogProps, IMemberModel, TQueryProps } from "@types";
import InviteMemberDialog from "@common/dialogs/InviteMemberDialog";
import useDialog from "@utils/useDialog";
import { ICustomError } from "@utils/CustomError";
import getUserName from "@utils/getUserName";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import formatDate from "@utils/formatDate";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import stringAvatar from "@utils/makeShortName";

export const SpaceMembers = (props: any) => {
  const { owner } = props;
  const { spaceId = "" } = useParams();
  const { service } = useServiceContext();
  const { dispatch, userInfo } = useAuthContext();
  const userId = userInfo?.id;
  const user_id_ref = useRef<HTMLInputElement>(null);
  const spaceMembersQueryData = useQuery<IMemberModel>({
    service: (args, config) => service.fetchSpaceMembers({ spaceId }, config),
  });
  const dialogProps = useDialog();
  const {
    query: addMember,
    loading,
    data,
  } = useQuery({
    service: (
      { id = spaceId, value = user_id_ref.current?.value }: any,
      config
    ) => service.addMemberToSpace({ spaceId: id, email: value }, config),
    runOnMount: false,
  });

  const resetForm = () => {
    user_id_ref.current?.form?.reset();
  };

  useEffect(() => {
    let controller: AbortController;
    if (data?.id) {
      controller = new AbortController();
      resetForm();
      spaceMembersQueryData.query();
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
    <Box mt={1} p={3} sx={{ borderRadius: 1, background: "white" }}>
      <Box>
        <Title
          size="small"
          mb={2}
          titleProps={{
            fontSize: "1rem",
            fontFamily: "Roboto",
            textTransform: "unset",
            letterSpacing: ".05rem",
          }}
        >
          <Trans i18nKey="addNewMember" />
        </Title>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!user_id_ref.current?.value) {
              toast.error(t("pleaseEnterEmailAddress") as string);
            } else {
              try {
                await addMember({
                  id: spaceId,
                  value: user_id_ref.current?.value,
                });
                await spaceMembersQueryData.query();
                user_id_ref.current.value = "";
              } catch (e) {
                const err = e as ICustomError;
                if (err.response.data.code === "user-is-member") {
                  toastError(err.response.data.message);
                } else {
                  dialogProps.openDialog({
                    type: "invite",
                    data: { email: user_id_ref.current?.value },
                  });
                }
              }
            }
          }}
        >
          <TextField
            fullWidth
            type={"email"}
            size="small"
            variant="outlined"
            inputRef={user_id_ref}
            placeholder={t("enterEmailOfTheUserYouWantToAdd") as string}
            label={<Trans i18nKey="userEmail" />}
            InputProps={{
              endAdornment: <AddMemberButton loading={loading} />,
            }}
          />
        </form>
      </Box>
      <Box mt={6}>
        <Title
          mb={2}
          size="small"
          titleProps={{
            fontSize: "1rem",
            fontFamily: "Roboto",
            textTransform: "capitalize",
            letterSpacing: ".05rem",
          }}
          toolbar={
            <Box sx={{ ...styles.centerV, opacity: 0.8, mb: "auto" }}>
              <PeopleOutlineRoundedIcon sx={{ mr: 0.5 }} fontSize="small" />
              <Typography fontFamily="Roboto" fontWeight={"bold"}>
                {
                  spaceMembersQueryData?.data?.results?.filter(
                    (item: any) => !!item.user
                  )?.length
                }
              </Typography>
            </Box>
          }
        >
          <Trans i18nKey="members" />
        </Title>
        <QueryData
          {...spaceMembersQueryData}
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
            const { items } = data;
            const invitees = items.filter((item: any) => !item.displayName);
            return (
              <Box>
                {items.map((member: any) => {
                  const { displayName, id , pictureLink } = member;
                  const isOwner = owner?.id == displayName?.id;
                  return (
                      displayName && (
                      <Box
                        key={id}
                        sx={{
                          ...styles.centerV,
                          boxShadow: 1,
                          borderRadius: 2,
                          my: 1,
                          py: 0.8,
                          px: 1.5,
                        }}
                      >
                        <Box sx={{ ...styles.centerV }}>
                          <Box>
                            <Avatar
                                    {...stringAvatar(displayName.toUpperCase())}
                                    src={pictureLink}
                                    sx={{ width: 34, height: 34 }}>
                            </Avatar>
                          </Box>
                          <Box ml={2}>{displayName}</Box>
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
                              fetchSpaceMembers={spaceMembersQueryData.query}
                            />
                          }
                        </Box>
                      </Box>
                    )
                  );
                })}
                {invitees.length > 0 && (
                  <Box mt={4}>
                    <Title
                      size="small"
                      titleProps={{
                        textTransform: "none",
                        fontSize: ".95rem",
                        fontFamily: "Roboto",
                      }}
                    >
                      <Trans i18nKey="invitees" />
                    </Title>
                    <Box mt={1}>
                      {invitees.map((member: any) => {
                        const {
                          user,
                          id,
                          invite_email,
                          invite_expiration_date,
                        } = member;
                        const name = getUserName(user) || invite_email;
                        const isOwner = userId == user?.id;

                        return (
                          !user && (
                            <Box
                              key={id}
                              sx={{
                                ...styles.centerV,
                                boxShadow: 1,
                                borderRadius: 2,
                                flexDirection:{xs:"column",sm:"row"},
                                my: 1,
                                py: 0.8,
                                px: 1.5,
                              }}
                            >
                              <Box sx={{ ...styles.centerV,mr:{xs:"auto",sm:"0px"} }}>
                                <Box>
                                  <Avatar sx={{ width: 34, height: 34 }}>
                                    <PersonRoundedIcon />
                                  </Avatar>
                                </Box>
                                <Box ml={2}>{name}</Box>
                              </Box>
                              <Box ml="auto" sx={{ ...styles.centerV }}>
                                <Box
                                  sx={{
                                    ...styles.centerV,
                                    opacity: 0.8,
                                    px: 0.4,
                                    mr: 2,
                                  }}
                                >
                                  <EventBusyRoundedIcon
                                    fontSize="small"
                                    sx={{ mr: 0.5 }}
                                  />
                                  <Typography variant="body2">
                                    {formatDate(invite_expiration_date)}
                                  </Typography>
                                </Box>
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
                                    fetchSpaceMembers={
                                      spaceMembersQueryData.query
                                    }
                                    isInvitationExpired={true}
                                    isInvitees={true}
                                    email={invite_email}
                                  />
                                }
                              </Box>
                            </Box>
                          )
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Box>
            );
          }}
        />
      </Box>
      <InviteSpaceMemberDialog
        {...dialogProps}
        spaceMembersQueryData={spaceMembersQueryData}
        resetForm={resetForm}
      />
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
  const { member, fetchSpaceMembers, isInvitees, isInvitationExpired, email } =
    props;
  const { spaceId = "" } = useParams();
  const { service } = useServiceContext();
  const { query: deleteSpaceMember, loading } = useQuery({
    service: (arg, config) =>
      service.deleteSpaceMember({ spaceId, memberId: member.id }, config),
    runOnMount: false,
    toastError: false,
  });
  const inviteMemberQueryData = useQuery({
    service: (args = { id: spaceId, data: { email } }, config) =>
      service.inviteSpaceMember(args, config),
    runOnMount: false,
  });

  const deleteItem = async (e: any) => {
    try {
      await deleteSpaceMember();
      await fetchSpaceMembers();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err?.response?.data?.message);
    }
  };

  const inviteMember = async () => {
    try {
      await inviteMemberQueryData.query();
      toast.success("Invitation has been send successfully.");
      fetchSpaceMembers();
    } catch (e) {
      toastError(e as ICustomError);
    }
  };

  return (
    <MoreActions
      {...useMenu()}
      loading={loading || inviteMemberQueryData.loading}
      items={[
        isInvitees && isInvitationExpired
          ? {
              icon: <EmailRoundedIcon fontSize="small" />,
              text: <Trans i18nKey="resendInvitation" />,
              onClick: inviteMember,
            }
          : undefined,
        isInvitees && {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="cancelInvitation" />,
          onClick: deleteItem,
        },
        // !isInvitees && {
        //   icon: <DeleteRoundedIcon fontSize="small" />,
        //   text: <Trans i18nKey="remove" />,
        //   onClick: deleteItem,
        // },
      ]}
    />
  );
};

const InviteSpaceMemberDialog = (
  props: {
    spaceMembersQueryData: TQueryProps;
    resetForm: () => void;
  } & IDialogProps
) => {
  const { spaceMembersQueryData, resetForm, ...rest } = props;
  const { spaceId } = useParams();
  const { service } = useServiceContext();
  const { query: inviteMemberQuery, loading } = useQuery({
    service: (args = { id: spaceId, data: rest.context?.data || {} }, config) =>
      service.inviteSpaceMember(args, config),
    runOnMount: false,
  });

  const onInvite = async () => {
    try {
      await inviteMemberQuery();
      toast.success("Invitation has been send successfully.");
      resetForm();
      rest.onClose();
      spaceMembersQueryData.query();
    } catch (e) {
      toastError(e as ICustomError);
    }
  };

  return (
    <InviteMemberDialog
      {...(rest as any)}
      onInvite={onInvite}
      loading={loading}
      maxWidth="sm"
    >
      <Typography>
        <Trans
          i18nKey="emailIsNotOnFlickitYet"
          values={{ email: rest.context?.data?.email || "This user" }}
        />{" "}
        <Trans i18nKey={"wouldYouLikeToInviteThemToJoin"} />
      </Typography>
    </InviteMemberDialog>
  );
};
