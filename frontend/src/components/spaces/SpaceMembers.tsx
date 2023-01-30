import { Box } from "@mui/material";
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
import { IDialogProps, IMemberModel, TQueryProps } from "../../types";
import InviteMemberDialog from "../shared/dialogs/InviteMemberDialog";
import useDialog from "../../utils/useDialog";
import { ICustomError } from "../../utils/CustomError";
import getUserName from "../../utils/getUserName";

export const SpaceMembers = () => {
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
    service: ({ id = spaceId, value = user_id_ref.current?.value }: any, config) =>
      service.addMemberToSpace({ spaceId: id, email: value }, config),
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
        <Title size="small" fontSize={"1rem"} fontFamily="Roboto" textTransform={"unset"} letterSpacing=".05rem" mb={2}>
          <Trans i18nKey="addNewMember" />
        </Title>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!user_id_ref.current?.value) {
              toast.error(t("pleaseEnterEmailAddress") as string);
            } else {
              try {
                await addMember({ id: spaceId, value: user_id_ref.current?.value });
              } catch (e) {
                const err = e as ICustomError;
                dialogProps.openDialog({ type: "invite", data: { email: user_id_ref.current?.value } });
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
          size="small"
          mb={2}
          fontSize={"1rem"}
          fontFamily="Roboto"
          textTransform={"capitalize"}
          letterSpacing=".05rem"
          toolbar={
            <Box sx={{ ...styles.centerV, opacity: 0.8, mb: "auto" }}>
              <PeopleOutlineRoundedIcon sx={{ mr: 0.5 }} fontSize="small" />
              <Typography fontFamily="Roboto" fontWeight={"bold"}>
                {spaceMembersQueryData?.data?.results?.filter((item: any) => !!item.user)?.length}
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
                  return <Skeleton key={item} variant="rectangular" sx={{ borderRadius: 2, height: "50px", mb: 1 }} />;
                })}
              </>
            );
          }}
          render={(data) => {
            const { results } = data;
            const invitees = results.filter((item: any) => !item.user);

            return (
              <Box>
                {results.map((member: any) => {
                  const { user, id } = member;
                  const name = getUserName(user);
                  const isOwner = userId == user?.id;

                  return (
                    user && (
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
                            <Avatar sx={{ width: 34, height: 34 }}>
                              <PersonRoundedIcon />
                            </Avatar>
                          </Box>
                          <Box ml={2}>{name}</Box>
                        </Box>
                        <Box ml="auto" sx={{ ...styles.centerV }}>
                          {isOwner && <Chip label={<Trans i18nKey="owner" />} size="small" sx={{ mr: 1.5 }} />}
                          {<Actions isOwner={isOwner} member={member} fetchSpaceMembers={spaceMembersQueryData.query} />}
                        </Box>
                      </Box>
                    )
                  );
                })}
                {invitees.length > 0 && (
                  <Box mt={4}>
                    <Title textTransform={"none"} size="small" fontSize={".95rem"} fontFamily="Roboto">
                      <Trans i18nKey="invitees" />
                    </Title>
                    <Box mt={1}>
                      {invitees.map((member: any) => {
                        const { user, id, invite_email } = member;
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
                                my: 1,
                                py: 0.8,
                                px: 1.5,
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
                              {/* <Box ml="auto" sx={{ ...styles.centerV }}>
                                {isOwner && <Chip label={<Trans i18nKey="owner" />} size="small" sx={{ mr: 1.5 }} />}
                                {<Actions isOwner={isOwner} member={member} fetchSpaceMembers={spaceMembersQueryData.query} />}
                              </Box> */}
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
      <InviteSpaceMemberDialog {...dialogProps} spaceMembersQueryData={spaceMembersQueryData} resetForm={resetForm} />
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
        {isSmallScreen ? <AddRoundedIcon fontSize="small" /> : <Trans i18nKey={"addMember"} />}
      </LoadingButton>
    </InputAdornment>
  );
};

const Actions = (props: any) => {
  const { member, fetchSpaceMembers } = props;
  const { spaceId = "" } = useParams();
  const { service } = useServiceContext();
  const { query: deleteSpaceMember, loading } = useQuery({
    service: (arg, config) => service.deleteSpaceMember({ spaceId, memberId: member.id }, config),
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

const InviteSpaceMemberDialog = (props: { spaceMembersQueryData: TQueryProps; resetForm: () => void } & IDialogProps) => {
  const { spaceMembersQueryData, resetForm, ...rest } = props;
  const { spaceId } = useParams();
  const { service } = useServiceContext();
  const { query: inviteMemberQuery, loading } = useQuery({
    service: (args = { id: spaceId, data: rest.context?.data || {} }, config) => service.inviteSpaceMember(args, config),
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
    <InviteMemberDialog {...(rest as any)} onInvite={onInvite} loading={loading} maxWidth="sm">
      <Typography>
        <Trans i18nKey="emailIsNotOnFlickitYet" values={{ email: rest.context?.data?.email || "This user" }} />{" "}
        <Trans i18nKey={"wouldYouLikeToInviteThemToJoin"} />
      </Typography>
    </InviteMemberDialog>
  );
};
