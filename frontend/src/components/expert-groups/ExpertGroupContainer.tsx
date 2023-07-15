import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link as MLink,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import QueryData, { useQueryDataContext } from "@common/QueryData";
import Title from "@common/Title";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import { styles } from "@styles";
import { Trans } from "react-i18next";
import RichEditor from "@common/rich-editor/RichEditor";
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import AssignmentLateRoundedIcon from "@mui/icons-material/AssignmentLateRounded";
import { t } from "i18next";
import { IDialogProps, TQueryFunction } from "@types";
import getUserName from "@utils/getUserName";
import forLoopComponent from "@utils/forLoopComponent";
import { LoadingSkeleton } from "@common/loadings/LoadingSkeleton";
import AssessmentKitListItem from "../assessment-kit/AssessmentKitListItem";
import toastError from "@utils/toastError";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MinimizeRoundedIcon from "@mui/icons-material/MinimizeRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRef, useState } from "react";
import { ICustomError } from "@utils/CustomError";
import useDialog from "@utils/useDialog";
import AssessmentKitCEFromDialog from "../assessment-kit/AssessmentKitCEFromDialog";
import { toast } from "react-toastify";
import ErrorEmptyData from "@common/errors/ErrorEmptyData";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import { useAuthContext } from "@providers/AuthProvider";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import formatDate from "@utils/formatDate";
import useMenu from "@utils/useMenu";
import MoreActions from "@common/MoreActions";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import useDocumentTitle from "@utils/useDocumentTitle";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import ExpertGroupCEFormDialog from "./ExpertGroupCEFormDialog";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

const ExpertGroupContainer = () => {
  const { service } = useServiceContext();
  const { expertGroupId } = useParams();
  const { userInfo } = useAuthContext();
  const queryData = useQuery({
    service: (args = { id: expertGroupId }, config) =>
      service.fetchUserExpertGroup(args, config),
  });

  const expertGroupMembersQueryData = useQuery({
    service: (args = { id: expertGroupId }, config) =>
      service.fetchExpertGroupMembers(args, config),
  });

  const setDocTitle = useDocumentTitle(t("expertGroup") as string);
  const createAssessmentKitDialogProps = useDialog({
    context: { type: "create", data: { expertGroupId } },
  });
  const [unpublishedAssessmentKits, setUnpublishedAssessmentKits] =
    useState<any>({});
  return (
    <QueryData
      {...queryData}
      render={(data) => {
        const {
          name,
          picture,
          website,
          about = "",
          number_of_members,
          number_of_assessment_kits,
          users = [],
          bio,
          owner,
          is_expert,
          is_member,
          assessment_kits = [],
        } = data || {};
        const hasAccess = is_expert;
        setDocTitle(`${t("expertGroup")}: ${name || ""}`);

        return (
          <Box>
            <Title
              borderBottom
              pb={1}
              avatar={<Avatar src={picture} sx={{ mr: 1 }} />}
              sup={
                <SupTitleBreadcrumb
                  routes={[
                    {
                      title: t("expertGroups") as string,
                      to: `/user/expert-groups`,
                    },
                  ]}
                />
              }
              toolbar={
                hasAccess && (
                  <EditExpertGroupButton fetchExpertGroup={queryData.query} />
                )
              }
            >
              {name}
            </Title>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={8}>
                {about && (
                  <>
                    <Title size="small">
                      <Trans i18nKey="about" />
                    </Title>
                    <Box
                      sx={{ p: 3, mt: 1, borderRadius: 2, background: "white" }}
                    >
                      <Box minHeight={"160px"} mb={4}>
                        <RichEditor content={about} />
                      </Box>
                    </Box>
                  </>
                )}
                <Box mt={5}>
                  <AssessmentKitsList
                    setUnpublishedAssessmentKits={setUnpublishedAssessmentKits}
                    queryData={queryData}
                    hasAccess={hasAccess}
                    dialogProps={createAssessmentKitDialogProps}
                    is_member={is_member}
                  />
                </Box>
                <Box mt={5}>
                  <ExpertGroupMembersDetail
                    queryData={expertGroupMembersQueryData}
                    hasAccess={hasAccess}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  p={2}
                  sx={{ borderRadius: 2, p: 3, background: "white", mt: 5 }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      display="flex"
                      alignItems={"center"}
                      sx={{ mb: 1.5 }}
                    >
                      <Trans i18nKey="groupSummary" />
                    </Typography>
                    {bio && (
                      <Box mt={1}>
                        <Typography>{bio}</Typography>
                      </Box>
                    )}
                    {website && (
                      <Box sx={{ ...styles.centerV, mt: 1 }}>
                        <InsertLinkRoundedIcon
                          fontSize="small"
                          sx={{
                            mr: 1,
                            transform: "rotateZ(-45deg)",
                            opacity: 0.8,
                          }}
                        />

                        <MLink
                          target="_blank"
                          href={website}
                          sx={{
                            textDecoration: "none",
                            opacity: 0.9,
                            fontWeight: "bold",
                          }}
                        >
                          {website
                            ?.replace("https://", "")
                            .replace("http://", "")}
                        </MLink>
                      </Box>
                    )}
                    <Box sx={{ ...styles.centerV, mt: 1, fontSize: ".9rem" }}>
                      <PeopleRoundedIcon
                        fontSize="small"
                        sx={{ mr: 1, opacity: 0.8 }}
                      />

                      <Typography
                        sx={{
                          opacity: 0.9,
                          fontSize: "inherit",
                        }}
                      >
                        {number_of_members} {t("members").toLowerCase()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        ...styles.centerV,
                        mt: 1,
                        fontSize: ".9rem",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                      component="a"
                      href="#assessment-kits"
                    >
                      <AssignmentRoundedIcon
                        fontSize="small"
                        sx={{ mr: 1, opacity: 0.8 }}
                      />

                      <Typography
                        sx={{
                          opacity: 0.9,
                          fontSize: "inherit",
                        }}
                      >
                        {`${number_of_assessment_kits} ${t(
                          "publishedAssessmentKits"
                        ).toLowerCase()}`}
                      </Typography>
                      {hasAccess && (
                        <Box ml="auto">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              createAssessmentKitDialogProps.openDialog({
                                type: "create",
                                data: { expertGroupId },
                              });
                            }}
                          >
                            <AddRoundedIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                    {is_expert && (
                      <Box
                        sx={{
                          ...styles.centerV,
                          mt: 1,
                          fontSize: ".9rem",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                        component="a"
                        href="#assessment-kits"
                      >
                        <AssignmentLateRoundedIcon
                          fontSize="small"
                          sx={{ mr: 1, opacity: 0.8 }}
                        />

                        <Typography
                          sx={{
                            opacity: 0.9,
                            fontSize: "inherit",
                          }}
                        >
                          {`${unpublishedAssessmentKits?.length} ${t(
                            "unpublishedAssessmentKits"
                          ).toLowerCase()}`}
                        </Typography>
                      </Box>
                    )}
                    <Divider sx={{ mt: 2, mb: 2 }} />
                  </Box>
                  {/* --------------------------- */}
                  <ExpertGroupMembers
                    {...expertGroupMembersQueryData}
                    hasAccess={hasAccess}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      }}
    />
  );
};

const EditExpertGroupButton = (props: any) => {
  const { fetchExpertGroup } = props;
  const { service } = useServiceContext();
  const { expertGroupId } = useParams();
  const queryData = useQuery({
    service: (args = { id: expertGroupId }, config) =>
      service.fetchUserExpertGroup(args, config),
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
        <Trans i18nKey="editExpertGroup" />
      </LoadingButton>
      <ExpertGroupCEFormDialog
        {...dialogProps}
        hideSubmitAndView={true}
        onSubmitForm={fetchExpertGroup}
      />
    </>
  );
};

const ExpertGroupMembers = (props: any) => {
  const { hasAccess, ...rest } = props;
  const [openInvitees, setOpenInvitees] = useState(false);
  const [openAddMembers, setOpenAddMembers] = useState(false);

  return (
    <QueryData
      {...rest}
      render={(data) => {
        const { results = [] } = data;
        const invitees = results.filter((user: any) => user.user === null);
        const users = results.filter((user: any) => user.user !== null);
        const hasInvitees = invitees.length > 0;

        return (
          <Box>
            <Typography
              variant="h6"
              display="flex"
              alignItems={"center"}
              component="a"
              href="#members"
              sx={{ textDecoration: "none", mb: 2, color: "inherit" }}
            >
              <Trans i18nKey="members" />
            </Typography>
            {hasAccess && (
              <AddingNewMember
                queryData={rest}
                setOpenAddMembers={setOpenAddMembers}
                openAddMembers={openAddMembers}
              />
            )}
            {hasAccess && hasInvitees && (
              <Box mb={2}>
                <Invitees
                  users={invitees}
                  query={rest.query}
                  setOpenInvitees={setOpenInvitees}
                  openInvitees={openInvitees}
                />
              </Box>
            )}
            <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1.5 }}>
              <AvatarGroup>
                {users.map((user: any) => {
                  const name = getUserName(user?.user);
                  return (
                    <Avatar
                      key={user.id}
                      alt={name}
                      title={name}
                      src={user?.picture || "/"}
                    />
                  );
                })}
              </AvatarGroup>
            </Box>
          </Box>
        );
      }}
    />
  );
};

const Invitees = (props: any) => {
  const { users, query, setOpenInvitees, openInvitees } = props;

  return (
    <Box>
      <Typography
        variant="h6"
        display="flex"
        alignItems={"center"}
        sx={{ fontSize: ".9rem", opacity: 0.8, cursor: "pointer" }}
        onClick={() => setOpenInvitees((state: boolean) => !state)}
      >
        <Trans i18nKey="invitees" />
        <Box
          sx={{
            ...styles.centerV,
            ml: "auto",
          }}
        >
          {openInvitees ? (
            <MinimizeRoundedIcon fontSize="small" />
          ) : (
            <AddRoundedIcon fontSize="small" />
          )}
        </Box>
      </Typography>
      <Collapse in={openInvitees}>
        <Box sx={{ display: "flex", flexWrap: "wrap", my: 1 }}>
          {users.map((user: any) => {
            const { invite_email, invite_expiration_date, id } = user;
            return (
              <Box
                key={user.id}
                sx={{
                  ...styles.centerV,
                  boxShadow: 1,
                  borderRadius: 2,
                  my: 0.5,
                  py: 0.8,
                  px: 1.5,
                  width: "100%",
                }}
              >
                <Box sx={{ ...styles.centerV }}>
                  <Box>
                    <Avatar sx={{ width: 34, height: 34 }} alt={invite_email} />
                  </Box>
                  <Box ml={2}>
                    {invite_email}
                    <Box sx={{ ...styles.centerV, opacity: 0.85 }}>
                      <EventBusyRoundedIcon
                        fontSize="small"
                        sx={{ mr: 0.7, opacity: 0.9 }}
                      />
                      <Typography variant="body2">
                        {formatDate(invite_expiration_date)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box ml="auto" sx={{ ...styles.centerV }}>
                  <MemberActions
                    query={query}
                    userId={id}
                    email={invite_email}
                    isInvitationExpired={true}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

const MemberActions = (props: any) => {
  const { query, userId, email, isInvitationExpired } = props;
  const { expertGroupId = "" } = useParams();
  const { service } = useServiceContext();
  const { query: deleteExpertGroupMember, loading } = useQuery({
    service: (arg, config) =>
      service.deleteExpertGroupMember(
        { id: expertGroupId, userId: userId },
        config
      ),
    runOnMount: false,
    toastError: true,
  });

  const addMemberQueryData = useQuery({
    service: (args, config) => service.addMemberToExpertGroup(args, config),
    runOnMount: false,
  });

  const deleteItem = async (e: any) => {
    await deleteExpertGroupMember();
    await query();
  };

  const inviteMember = async () => {
    try {
      const res = await addMemberQueryData.query({
        id: expertGroupId,
        email,
      });
      res?.message && toast.success(res.message);
      query();
    } catch (e) {
      const error = e as ICustomError;
      if ("message" in error.data || {}) {
        if (Array.isArray(error.data.message)) {
          toastError(error.data?.message[0]);
        } else if (error.data?.message) {
          toastError(error.data?.message);
        }
      }
    }
  };

  return (
    <MoreActions
      {...useMenu()}
      loading={loading}
      items={[
        isInvitationExpired
          ? {
              icon: <EmailRoundedIcon fontSize="small" />,
              text: <Trans i18nKey="resendInvitation" />,
              onClick: inviteMember,
            }
          : undefined,
        {
          icon: <DeleteRoundedIcon fontSize="small" />,
          text: <Trans i18nKey="cancelInvitation" />,
          onClick: deleteItem,
        },
      ]}
    />
  );
};

const AddingNewMember = (props: any) => {
  const { queryData, setOpenAddMembers, openAddMembers } = props;

  return (
    <Box>
      <Typography
        variant="h6"
        display="flex"
        alignItems={"center"}
        sx={{ mb: 2, fontSize: ".9rem", opacity: 0.8, cursor: "pointer" }}
        onClick={() => setOpenAddMembers((state: boolean) => !state)}
      >
        <Trans i18nKey="addMember" />
        <Box
          sx={{
            ...styles.centerV,
            ml: "auto",
          }}
        >
          {openAddMembers ? (
            <MinimizeRoundedIcon fontSize="small" />
          ) : (
            <AddRoundedIcon fontSize="small" />
          )}
        </Box>
      </Typography>
      <Collapse in={openAddMembers}>
        <AddMember queryData={queryData} />
      </Collapse>
    </Box>
  );
};

const AddMember = (props: any) => {
  const { queryData } = props;
  const { query } = queryData;
  const inputRef = useRef<HTMLInputElement>(null);
  const { service } = useServiceContext();
  const { expertGroupId } = useParams();
  const addMemberQueryData = useQuery({
    service: (args, config) => service.addMemberToExpertGroup(args, config),
    runOnMount: false,
  });

  const addMember = async () => {
    try {
      const res = await addMemberQueryData.query({
        id: expertGroupId,
        email: inputRef.current?.value,
      });
      res?.message && toast.success(res.message);
      query();
    } catch (e) {
      const error = e as ICustomError;
      if ("message" in error.data || {}) {
        if (Array.isArray(error.data.message)) {
          toastError(error.data?.message[0]);
        } else if (error.data?.message) {
          toastError(error.data?.message);
        }
      }
    }
  };

  return (
    <Box
      component="form"
      sx={{ mb: 2, mt: 0 }}
      onSubmit={(e) => {
        e.preventDefault();
        if (!inputRef.current?.value) {
          toastError(t("pleaseEnterEmailAddress") as string);
        } else addMember();
      }}
    >
      <TextField
        fullWidth
        type={"email"}
        size="small"
        variant="outlined"
        inputRef={inputRef}
        placeholder={t("enterEmailOfTheUserYouWantToAdd") as string}
        label={<Trans i18nKey="userEmail" />}
        InputProps={{
          endAdornment: (
            <AddMemberButton loading={addMemberQueryData.loading} />
          ),
        }}
      />
    </Box>
  );
};

const AddMemberButton = ({ loading }: { loading: boolean }) => {
  return (
    <InputAdornment position="end">
      <LoadingButton
        sx={{
          mr: "-10px",
          minWidth: "10px",
          p: 0.5,
        }}
        loading={loading}
        type="submit"
        variant="contained"
        size="small"
      >
        <AddRoundedIcon fontSize="small" />
      </LoadingButton>
    </InputAdornment>
  );
};

const AssessmentKitsList = (props: any) => {
  const {
    hasAccess,
    dialogProps,
    about,
    setUnpublishedAssessmentKits,
    is_member,
  } = props;
  const { expertGroupId } = useParams();
  const { service } = useServiceContext();
  const assessmentKitQuery = useQuery({
    service: (args = { id: expertGroupId }, config) =>
      service.fetchExpertGroupAssessmentKits(args, config),
  });
  const unpublishedAssessmentKitQuery = useQuery({
    service: (args = { id: expertGroupId }, config) =>
      service.fetchExpertGroupUnpublishedAssessmentKits(args, config),
  });
  return (
    <>
      <Title
        inPageLink="assessment_kits"
        size="small"
        toolbar={
          hasAccess && (
            <CreateAssessmentKitButton
              onSubmitForm={assessmentKitQuery.query}
              dialogProps={dialogProps}
            />
          )
        }
      >
        <Trans i18nKey={"assessmentKits"} />
      </Title>
      <Box mt={2}>
        {/* published */}
        <QueryData
          {...assessmentKitQuery}
          emptyDataComponent={
            <Box sx={{ background: "white", borderRadius: 2 }}>
              <ErrorEmptyData
                emptyMessage={
                  <Trans i18nKey="thereIsNoPublishedAssessmentKitYet" />
                }
              />
            </Box>
          }
          isDataEmpty={(data) => {
            const { results = [], is_expert } = data;
            const isEmpty = is_expert
              ? results.length === 0
              : results.filter((p: any) => !!p?.is_active)?.length === 0;
            return isEmpty;
          }}
          renderLoading={() => (
            <>
              {forLoopComponent(5, (index) => (
                <LoadingSkeleton key={index} sx={{ height: "60px", mb: 1 }} />
              ))}
            </>
          )}
          render={(data = {}) => {
            const { results = [], is_expert } = data;
            return (
              <>
                {results.map((assessment_kit: any) => {
                  return (
                    <AssessmentKitListItem
                      link={
                        is_expert
                          ? `assessment-kits/${assessment_kit?.id}`
                          : `/assessment-kits/${assessment_kit?.id}`
                      }
                      key={assessment_kit?.id}
                      data={assessment_kit}
                      fetchAssessmentKits={assessmentKitQuery.query}
                      fetchUnpublishedAssessmentKits={
                        is_member && unpublishedAssessmentKitQuery.query
                      }
                      hasAccess={is_expert}
                      is_member={is_member}
                    />
                  );
                })}
              </>
            );
          }}
        />
        {/* unpublished */}
        {is_member && (
          <QueryData
            {...unpublishedAssessmentKitQuery}
            showEmptyError={false}
            emptyDataComponent={
              <Box sx={{ background: "white", borderRadius: 2 }}>
                <ErrorEmptyData
                  emptyMessage={
                    <Trans i18nKey="thereIsNoUnpublishedAssessmentKitYet" />
                  }
                />
              </Box>
            }
            renderLoading={() => (
              <>
                {forLoopComponent(5, (index) => (
                  <LoadingSkeleton key={index} sx={{ height: "60px", mb: 1 }} />
                ))}
              </>
            )}
            isDataEmpty={(data) => {
              const { results = [], is_expert } = data;
              const isEmpty = is_expert
                ? results.length === 0
                : results.filter((p: any) => !!p?.is_active)?.length === 0;
              return isEmpty;
            }}
            render={(data = {}) => {
              const { results = [], is_expert } = data;
              setUnpublishedAssessmentKits(results);
              return (
                <>
                  {is_member &&
                    results.map((assessment_kit: any) => {
                      return (
                        <AssessmentKitListItem
                          link={
                            is_expert
                              ? `assessment-kits/${assessment_kit?.id}`
                              : `/assessment-kits/${assessment_kit?.id}`
                          }
                          key={assessment_kit?.id}
                          data={assessment_kit}
                          fetchAssessmentKits={assessmentKitQuery.query}
                          fetchUnpublishedAssessmentKits={
                            is_member && unpublishedAssessmentKitQuery.query
                          }
                          hasAccess={hasAccess}
                          is_member={is_member}
                        />
                      );
                    })}
                </>
              );
            }}
          />
        )}
      </Box>
    </>
  );
};

const CreateAssessmentKitButton = (props: {
  onSubmitForm: TQueryFunction;
  dialogProps: IDialogProps;
}) => {
  const { onSubmitForm, dialogProps } = props;

  return (
    <>
      <Button variant="contained" size="small" onClick={dialogProps.openDialog}>
        <Trans i18nKey="createAssessmentKit" />
      </Button>
      <AssessmentKitCEFromDialog {...dialogProps} onSubmitForm={onSubmitForm} />
    </>
  );
};

const ExpertGroupMembersDetail = (props: any) => {
  const { queryData, hasAccess } = props;

  return (
    <>
      <Title inPageLink="members" size="small">
        <Trans i18nKey={"members"} />
      </Title>
      <Box mt={2} p={3} sx={{ borderRadius: 2, background: "white" }}>
        {hasAccess && (
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
            <AddMember queryData={queryData} />
          </Box>
        )}

        <QueryData
          {...queryData}
          render={(data) => {
            const { results = [] } = data;
            const invitees = results.filter((user: any) => user.user === null);
            const users = results.filter((user: any) => user.user !== null);
            const hasInvitees = invitees.length > 0;

            return (
              <Box mt={hasAccess ? 6 : 1}>
                <Box>
                  <Box>
                    {hasAccess && (
                      <Title
                        size="small"
                        titleProps={{
                          textTransform: "none",
                          fontSize: ".95rem",
                          fontFamily: "Roboto",
                          mb: 1,
                        }}
                      >
                        <Trans i18nKey="members" />
                      </Title>
                    )}
                    <Grid container spacing={2}>
                      {users.map((member: any) => {
                        const { user, id } = member;
                        const name = getUserName(user);
                        return (
                          <Grid item xs={12} sm={6} md={4} key={id}>
                            <Box
                              sx={{
                                ...styles.centerV,
                                boxShadow: 1,
                                borderRadius: 4,
                                background:
                                  "linear-gradient(145deg, #efaa9d, #ccf7f9)",
                                backgroundSize: "100% 64px",
                                backgroundRepeat: "no-repeat",
                                py: 1,
                                px: 1.8,
                              }}
                            >
                              <Box
                                sx={{
                                  mt: "28px",
                                  ...styles.centerCH,
                                  width: "100%",
                                }}
                              >
                                <Box sx={{ ...styles.centerCH }}>
                                  <Avatar
                                    sx={{
                                      width: 58,
                                      height: 58,
                                      border: "4px solid white",
                                    }}
                                    alt={name}
                                    src={user?.picture || "/"}
                                  />
                                  <Title
                                    titleProps={{
                                      sx: {
                                        textTransform: "none",
                                        justifyContent: "center",
                                      },
                                    }}
                                    subProps={{
                                      textAlign: "center",
                                      justifyContent: "center",
                                    }}
                                    ml={1}
                                    pt={0.5}
                                    size="small"
                                    sub={
                                      <Box
                                        component="a"
                                        href={user.linkedin}
                                        target="_blank"
                                        sx={{
                                          textDecoration: "none",
                                          color: "inherit",
                                        }}
                                      >
                                        {user.linkedin}
                                      </Box>
                                    }
                                  >
                                    {name}
                                  </Title>
                                </Box>
                                <Box mt={1} px={1} py={1} pb={3}>
                                  <Typography
                                    variant="body2"
                                    textAlign={"center"}
                                  >
                                    {user.bio}
                                  </Typography>
                                </Box>
                              </Box>
                              {/* <Box ml="auto" sx={{ ...styles.centerV }}>
                      {isOwner && <Chip label={<Trans i18nKey="owner" />} size="small" sx={{ mr: 1.5 }} />}
                      {<MemberActions isOwner={isOwner} member={member} fetchSpaceMembers={spaceMembersQueryData.query} />}
                    </Box> */}
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                  {hasInvitees && hasAccess && (
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
                          const name = invite_email;

                          return (
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
                                <MemberActions
                                  query={queryData.query}
                                  userId={id}
                                  isInvitationExpired={true}
                                  email={invite_email}
                                />
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          }}
        />
      </Box>
    </>
  );
};

export default ExpertGroupContainer;
