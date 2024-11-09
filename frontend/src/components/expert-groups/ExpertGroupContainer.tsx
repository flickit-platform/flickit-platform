import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MLink from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {useNavigate, useParams} from "react-router-dom";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import QueryData from "@common/QueryData";
import Title from "@common/TitleComponent";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import { styles } from "@styles";
import { Trans } from "react-i18next";
import RichEditor from "@common/rich-editor/RichEditor";
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import AssignmentLateRoundedIcon from "@mui/icons-material/AssignmentLateRounded";
import {t} from "i18next";
import forLoopComponent from "@utils/forLoopComponent";
import { LoadingSkeleton } from "@common/loadings/LoadingSkeleton";
import AssessmentKitListItem from "../assessment-kit/AssessmentKitListItem";
import toastError from "@utils/toastError";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import MinimizeRoundedIcon from "@mui/icons-material/MinimizeRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useRef, useState } from "react";
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
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import formatBytes from "@utils/formatBytes";
import { theme } from "@/config/theme";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

const ExpertGroupContainer = () => {
  const { service } = useServiceContext();
  const { expertGroupId } = useParams();
  const { userInfo } = useAuthContext();

  const {assessmentKitQuery, handleChangePage, ...rest } = useFetchAssessmentKit()
  const { size, total, page } = rest;

    const pageCount = size === 0 ? 1 : Math.ceil(total / size);
    const queryData = useQuery({
    service: (args = { id: expertGroupId }, config) =>
      service.fetchUserExpertGroup(args, config),
  });

  const expertGroupMembersQueryData = useQuery({
    service: (args = { id: expertGroupId, status: "ACTIVE" }, config) =>
      service.fetchExpertGroupMembers(args, config),
  });
  const expertGroupMembersInviteeQueryData = useQuery({
    service: (args = { id: expertGroupId, status: "PENDING" }, config) =>
      service.fetchExpertGroupMembers(args, config),
  });

  const setDocTitle = useDocumentTitle(t("expertGroup") as string);
  const createAssessmentKitDialogProps = useDialog({
    context: { type: "create", data: { expertGroupId } },
  });

  const excelToDslDialogProps = useDialog({
    context: { type: "convert" },
  });

  const [assessmentKitsCounts, setAssessmentKitsCounts] = useState<any>([]);
  const [numberOfMembers, setNumberOfMembers] = useState<any>(Number);
  return (
    <QueryData
      {...queryData}
      render={(data) => {
        const {
          title,
          pictureLink,
          website,
          about = "",
          bio,
          editable,
        } = data || {};
        const is_member = expertGroupMembersQueryData.data?.items?.some(
          (res: any) => {
            return res.id === userInfo.id;
          },
        );
        const hasAccess = editable;
        setDocTitle(`${t("expertGroup")}: ${title || ""}`);
        return (
          <Box>
            <Title
              backLink="/"
              borderBottom
              pb={1}
              avatar={
                <AvatarComponent
                  queryData={queryData}
                  picture={pictureLink}
                  editable={editable}
                />
              }
              sup={
                <SupTitleBreadcrumb
                  routes={[
                    {
                      title: t("expertGroups") as string,
                      to: `/user/expert-groups`,
                    },
                    {
                      title: title,
                    },
                  ]}
                />
              }
              toolbar={
                editable ? (
                  <EditExpertGroupButton fetchExpertGroup={queryData.query} />
                ) : (
                  <></>
                )
              }
            >
              {title}
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
                    queryData={queryData}
                    hasAccess={editable}
                    dialogProps={createAssessmentKitDialogProps}
                    excelToDslDialogProps={excelToDslDialogProps}
                    is_member={is_member}
                    is_expert={editable}
                    setAssessmentKitsCounts={setAssessmentKitsCounts}
                    assessmentKitQuery={assessmentKitQuery}
                  />
                    <Stack
                        spacing={2}
                        sx={{
                            mt: 3,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Pagination
                            variant="outlined"
                            color="primary"
                            count={pageCount}
                            onChange={handleChangePage}
                            page={page}
                        />
                    </Stack>
                </Box>
                <Box mt={5}>
                  <ExpertGroupMembersDetail
                    queryData={expertGroupMembersQueryData}
                    inviteeQueryData={expertGroupMembersInviteeQueryData}
                    hasAccess={editable}
                    setNumberOfMembers={setNumberOfMembers}
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
                            marginRight:
                              theme.direction === "ltr" ? 1 : "unset",
                            marginLeft: theme.direction === "rtl" ? 1 : "unset",
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
                            ?.replace("http://", "")}
                        </MLink>
                      </Box>
                    )}
                    <Box sx={{ ...styles.centerV, mt: 1, fontSize: ".9rem" }}>
                      <PeopleRoundedIcon
                        fontSize="small"
                        sx={{
                          marginRight: theme.direction === "ltr" ? 1 : "unset",
                          marginLeft: theme.direction === "rtl" ? 1 : "unset",
                          opacity: 0.8,
                        }}
                      />

                      <Typography
                        sx={{
                          opacity: 0.9,
                          fontSize: "inherit",
                        }}
                      >
                        {numberOfMembers} {t("members").toLowerCase()}
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
                        sx={{
                          marginRight: theme.direction === "ltr" ? 1 : "unset",
                          marginLeft: theme.direction === "rtl" ? 1 : "unset",
                          opacity: 0.8,
                        }}
                      />

                      <Typography
                        sx={{
                          opacity: 0.9,
                          fontSize: "inherit",
                        }}
                      >
                        {assessmentKitsCounts.filter(
                          (item: any) => item.published,
                        ) &&
                          `${
                            assessmentKitsCounts.filter(
                              (item: any) => item.published,
                            ).length
                          } ${t("publishedAssessmentKits").toLowerCase()}`}
                      </Typography>
                      {editable && (
                        <Box
                          ml={theme.direction === "rtl" ? "unset" : "auto"}
                          mr={theme.direction !== "rtl" ? "unset" : "auto"}
                        >
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
                    {editable && (
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
                          sx={{
                            marginRight:
                              theme.direction === "ltr" ? 1 : "unset",
                            marginLeft: theme.direction === "rtl" ? 1 : "unset",
                            opacity: 0.8,
                          }}
                        />

                        <Typography
                          sx={{
                            opacity: 0.9,
                            fontSize: "inherit",
                          }}
                        >
                          {assessmentKitsCounts.filter(
                            (item: any) => !item.published,
                          ) &&
                            `${
                              assessmentKitsCounts.filter(
                                (item: any) => !item.published,
                              ).length
                            } ${t("unpublishedAssessmentKits").toLowerCase()}`}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {editable && (
                    <Box>
                      <Divider sx={{ mt: 2, mb: 2 }} />
                      <ExpertGroupMembers
                        query={expertGroupMembersQueryData}
                        inviteeQuery={expertGroupMembersInviteeQueryData}
                        hasAccess={hasAccess}
                      />
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      }}
    />
  );
};

const useFetchAssessmentKit = () =>{
        const { service } = useServiceContext();
        const { expertGroupId = "" } = useParams();
        const PAGESIZE: number = 10;

        useEffect(() => {
            assessmentKitQuery.query({ id: expertGroupId, size:PAGESIZE, page: 1 })
        }, []);

    const handleChangePage = (
        event: React.ChangeEvent<unknown>,
        value: number,
    ) => {
        assessmentKitQuery.query({ id: expertGroupId, size:PAGESIZE, page: value || 1 })
    };

    const assessmentKitQuery = useQuery({
        service: (args , config) =>
            service.fetchExpertGroupAssessmentKits(args, config),
        runOnMount: false
    });
        return {
            data: assessmentKitQuery?.data?.items || [],
            page: (assessmentKitQuery?.data?.page + 1)|| 0,
            size: assessmentKitQuery?.data?.size || 0,
            total: assessmentKitQuery?.data?.total || 0,
            requested_space: assessmentKitQuery?.data?.requested_space,
            loaded: !!assessmentKitQuery?.data,
            assessmentKitQuery,
            handleChangePage
        };
};

const AvatarComponent = (props: any) => {
  const { title, picture, queryData, editable } = props;
  const [hover, setHover] = useState(false);
  const [profilePicture, setProfilePicture] = useState(picture);
  const [isLoading, setIsLoading] = useState(false);
  const { expertGroupId = "" } = useParams();
  const { service } = useServiceContext();

  useEffect(() => {
    setProfilePicture(picture);
  }, [picture]);

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const maxSize = 2097152;
      if (file.size > maxSize) {
        toastError(`Maximum upload file size is ${formatBytes(maxSize)}.`);
        return;
      }

      setHover(false);
      setProfilePicture("");
      setIsLoading(true);

      try {
        const pictureData = { pictureFile: file };
        const res = await service.updateExpertGroupPicture(
          { data: pictureData, id: expertGroupId },
          undefined,
        );
        setProfilePicture(res.data.pictureLink);
        setIsLoading(false);
      } catch (e: any) {
        setIsLoading(false);
        toastError(e as ICustomError);
      }
    }
  };

  const handleDelete = useQuery({
    service: (args = { expertGroupId }, config) =>
      service.deleteExpertGroupImage(args, config),
    runOnMount: false,
  });

  const deletePicture = async () => {
    try {
      setIsLoading(true);
      await handleDelete.query();
      setProfilePicture("");
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      toastError(e as ICustomError);
    }
  };

  return (
    <Box
      position="relative"
      display="inline-block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        marginRight: theme.direction === "ltr" ? 1 : "unset",
        marginLeft: theme.direction === "rtl" ? 1 : "unset",
      }}
    >
      <Avatar
        sx={{
          bgcolor: (t) => t.palette.grey[800],
          textDecoration: "none",
          width: 50,
          height: 50,
          position: "relative",
        }}
        src={profilePicture}
      >
        {title && !hover && title?.[0]?.toUpperCase()}
      </Avatar>
      {isLoading && (
        <CircularProgress
          size={24}
          sx={{
            position: "absolute",
            top: "50%",
            left: theme.direction === "ltr" ? "50%" : "unset",
            right: theme.direction === "rtl" ? "50%" : "unset",
            marginTop: "-12px",
            marginLeft: theme.direction === "ltr" ? "-12px" : "unset",
            marginRight: theme.direction === "rtl" ? "-12px" : "unset",
          }}
        />
      )}
      {!isLoading && (
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="50%"
        >
          {hover && (
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              bgcolor="rgba(0, 0, 0, 0.6)"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="50%"
              sx={{ cursor: "pointer" }}
            />
          )}
          {profilePicture ? (
            <>
              <Tooltip title={"Delete Picture"}>
                <IconButton
                  component="label"
                  sx={{ padding: 0, color: "whitesmoke" }}
                >
                  {hover && (
                    <DeleteIcon
                      onClick={deletePicture}
                      sx={{ color: "whitesmoke" }}
                    />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title={"Edit Picture"}>
                <IconButton
                  component="label"
                  sx={{ padding: 0, color: "whitesmoke" }}
                >
                  {hover && <EditIcon />}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title={"Add Picture"}>
              <IconButton component="label" sx={{ color: "whitesmoke" }}>
                {hover && <AddIcon />}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
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
  const { hasAccess, query, inviteeQuery } = props;
  const [openInvitees, setOpenInvitees] = useState(false);
  const [openAddMembers, setOpenAddMembers] = useState(false);

  return (
    <Box>
      <QueryData
        {...query}
        render={(data) => {
          const { items = [] } = data;

          const users = items.filter((user: any) => user.status === "ACTIVE");
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
                  queryData={query}
                  inviteeQuery={inviteeQuery}
                  setOpenAddMembers={setOpenAddMembers}
                  openAddMembers={openAddMembers}
                />
              )}

              <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1.5 }}>
                <AvatarGroup>
                  {users.map((user: any) => {
                    return (
                      <Avatar
                        key={user.id}
                        alt={user.title}
                        title={user.title}
                        src={user?.pictureLink || "/"}
                      />
                    );
                  })}
                </AvatarGroup>
              </Box>
            </Box>
          );
        }}
      />
      {hasAccess && (
        <QueryData
          {...inviteeQuery}
          render={(data) => {
            const { items = [] } = data;
            return (
              <Box my={2}>
                <Invitees
                  users={items}
                  query={query.query}
                  inviteeQuery={inviteeQuery.query}
                  setOpenInvitees={setOpenInvitees}
                  openInvitees={openInvitees}
                />
              </Box>
            );
          }}
        />
      )}
    </Box>
  );
};

const Invitees = (props: any) => {
  const { users, query, inviteeQuery, setOpenInvitees, openInvitees } = props;
  const hasInvitees = users.length > 0;
  return (
    <Box>
      {hasInvitees && (
        <Typography
          variant="h6"
          display="flex"
          alignItems={"center"}
          sx={{ fontSize: ".9rem", opacity: 0.8, cursor: "pointer" }}
          onClick={() => setOpenInvitees((state: boolean) => !state)}
        >
          <Trans i18nKey="invited" />
          <Box
            sx={{
              ...styles.centerV,
              ml: theme.direction === "rtl" ? "unset" : "auto",
              mr: theme.direction !== "rtl" ? "unset" : "auto",
            }}
          >
            {openInvitees ? (
              <MinimizeRoundedIcon fontSize="small" />
            ) : (
              <AddRoundedIcon fontSize="small" />
            )}
          </Box>
        </Typography>
      )}
      <Collapse in={openInvitees}>
        <Box sx={{ display: "flex", flexWrap: "wrap", my: 1 }}>
          {users.map((user: any) => {
            const { id, email, inviteExpirationDate, displayName } = user;
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
                    <Avatar sx={{ width: 34, height: 34 }} alt={displayName} />
                  </Box>
                  <Box ml={2}>
                    {displayName}
                    <Box sx={{ ...styles.centerV, opacity: 0.85 }}>
                      <EventBusyRoundedIcon
                        fontSize="small"
                        sx={{
                          marginRight: theme.direction === "ltr" ? 1 : "unset",
                          marginLeft: theme.direction === "rtl" ? 1 : "unset",
                          opacity: 0.9,
                        }}
                      />
                      <Typography variant="body2">
                          {theme.direction == "rtl" ? formatDate(inviteExpirationDate, "Shamsi") : formatDate(inviteExpirationDate, "Miladi")}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    ...styles.centerV,
                    ml: theme.direction === "rtl" ? "unset" : "auto",
                    mr: theme.direction !== "rtl" ? "unset" : "auto",
                  }}
                >
                  <MemberActions
                    query={query}
                    inviteeQuery={inviteeQuery}
                    userId={id}
                    email={email}
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
  const { query, inviteeQuery, userId, email, isInvitationExpired } = props;
  const { expertGroupId = "" } = useParams();
  const { service } = useServiceContext();
  const { query: deleteExpertGroupMember, loading } = useQuery({
    service: (arg, config) =>
      service.deleteExpertGroupMember(
        { id: expertGroupId, userId: userId },
        config,
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
    await inviteeQuery();
  };

  const inviteMember = async () => {
    try {
      const res = await addMemberQueryData.query({
        id: expertGroupId,
        email,
      });
      res?.message && toast.success(res.message);
      query();
      inviteeQuery();
    } catch (e) {
      const error = e as ICustomError;
      if (
        error.response?.data &&
        error.response?.data.hasOwnProperty("message")
      ) {
        if (Array.isArray(error.response?.data?.message)) {
          toastError(error.response?.data?.message[0]);
        } else {
          toastError(error);
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
  const { queryData, inviteeQuery, setOpenAddMembers, openAddMembers } = props;

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
            ml: theme.direction === "rtl" ? "unset" : "auto",
            mr: theme.direction !== "rtl" ? "unset" : "auto",
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
        <AddMember queryData={queryData} inviteeQuery={inviteeQuery} />
      </Collapse>
    </Box>
  );
};

const AddMember = (props: any) => {
  const { inviteeQuery } = props;
  const { query } = inviteeQuery;
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
      if (
        error.response?.data &&
        error.response?.data.hasOwnProperty("message")
      ) {
        if (Array.isArray(error.response?.data?.message)) {
          toastError(error.response?.data?.message[0]);
        } else {
          toastError(error);
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
          ml: theme.direction === "rtl" ? "unset" : "-10px",
          mr: theme.direction !== "rtl" ? "-10px" : "unset",
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
    setAssessmentKitsCounts,
    is_member,
    excelToDslDialogProps,
    assessmentKitQuery
  } = props;
  const { expertGroupId } = useParams();
  const kitDesignerDialogProps = useDialog({
    context: { type: "draft", data: { expertGroupId, dsl_id: 959 } },
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Title
        inPageLink="assessment_kits"
        size="small"
        toolbar={
          <Box sx={{ display: "flex", gap: "8px" }}>
            {hasAccess && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    excelToDslDialogProps.openDialog({
                      context: { type: "convert" },
                    });
                  }}
                >
                  <Trans i18nKey="convertExcelToDsl" />
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  onClick={handleClick}
                  endIcon={
                    open ? (
                      <ArrowDropUpRoundedIcon />
                    ) : (
                      <ArrowDropDownRoundedIcon />
                    )
                  }
                >
                  <Trans i18nKey="createAssessmentKit" />
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: 48 * 4.5,
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      dialogProps.openDialog({
                        context: { type: "create" },
                      });
                    }}
                  >
                    <Trans i18nKey="viaDSL" />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      kitDesignerDialogProps.openDialog({
                        context: { type: "draft" },
                      });
                    }}
                  >
                    <Trans i18nKey="viaKitDesigner" />
                  </MenuItem>
                </Menu>
                <AssessmentKitCEFromDialog {...dialogProps}  onSubmitForm={assessmentKitQuery.query}/>
                <AssessmentKitCEFromDialog
                  {...kitDesignerDialogProps}
                  onSubmitForm={assessmentKitQuery.query}
                />
                <AssessmentKitCEFromDialog
                  {...excelToDslDialogProps}
                  onSubmitForm={assessmentKitQuery.query}
                />
              </>
            )}
          </Box>
        }
      >
        <Trans i18nKey="assessmentKits" />
      </Title>
      <Box mt={2}>
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
            const { items } = data;
            const isEmpty = items;
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
            const { items } = data;
            if (items) {
              setAssessmentKitsCounts(items);
            }
            return (
              <>
                {items
                  ?.filter((item: any) => item.published)
                  ?.map((assessment_kit: any) => {
                    return (
                      <AssessmentKitListItem
                        link={
                          is_member
                            ? `assessment-kits/${assessment_kit?.id}`
                            : `/assessment-kits/${assessment_kit?.id}`
                        }
                        key={assessment_kit?.id}
                        data={assessment_kit}
                        fetchAssessmentKits={assessmentKitQuery.query}
                        hasAccess={hasAccess}
                        is_member={is_member}
                        is_active={true}
                      />
                    );
                  })}
                {is_member &&
                  items
                    ?.filter((item: any) => !item.published)
                    ?.map((assessment_kit: any) => {
                      return (
                        <AssessmentKitListItem
                          link={
                            is_member
                              ? `assessment-kits/${assessment_kit?.id}`
                              : `/assessment-kits/${assessment_kit?.id}`
                          }
                          key={assessment_kit?.id}
                          data={assessment_kit}
                          fetchAssessmentKits={assessmentKitQuery.query}
                          hasAccess={hasAccess}
                          is_member={is_member}
                          is_active={false}
                        />
                      );
                    })}
              </>
            );
          }}
        />
      </Box>
    </>
  );
};

const ExpertGroupMembersDetail = (props: any) => {
  const { queryData, inviteeQueryData, hasAccess, setNumberOfMembers } = props;

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
                textTransform: "unset",
                letterSpacing: ".05rem",
              }}
            >
              <Trans i18nKey="addNewMember" />
            </Title>
            <AddMember queryData={queryData} inviteeQuery={inviteeQueryData} />
          </Box>
        )}

        <QueryData
          {...queryData}
          render={(data) => {
            const { items = [] } = data;
            const users = items.filter((user: any) => user.status === "ACTIVE");
            setNumberOfMembers(users?.length);
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
                          mb: 1,
                        }}
                      >
                        <Trans i18nKey="members" />
                      </Title>
                    )}
                    <Grid container spacing={2}>
                      {users.map((member: any) => {
                        const {
                          displayName,
                          id,
                          pictureLink,
                          linkedin,
                          bio,
                        } = member;

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
                                    alt={displayName}
                                    src={pictureLink || "/"}
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
                                        href={linkedin}
                                        target="_blank"
                                        sx={{
                                          textDecoration: "none",
                                          color: "inherit",
                                        }}
                                      >
                                        {linkedin}
                                      </Box>
                                    }
                                  >
                                    {displayName}
                                  </Title>
                                </Box>
                                <Box mt={1} px={1} py={1} pb={3}>
                                  <Typography
                                    variant="body2"
                                    textAlign={"center"}
                                  >
                                    {bio}
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
                </Box>
              </Box>
            );
          }}
        />
        {hasAccess && (
          <QueryData
            {...inviteeQueryData}
            render={(data) => {
              const { items = [] } = data;
              const hasInvitees = items.length > 0;
              return (
                <Box mt={4}>
                  {hasInvitees && (
                    <Title
                      size="small"
                      titleProps={{
                        textTransform: "none",
                        fontSize: ".95rem",
                      }}
                    >
                      <Trans i18nKey="invitees" />
                    </Title>
                  )}
                  <Box mt={1}>
                    {items?.map((member: any) => {
                      const { id, email, inviteExpirationDate, displayName } =
                        member;

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
                            <Box ml={2}>{displayName}</Box>
                          </Box>
                          <Box
                            sx={{
                              ...styles.centerV,
                              ml: theme.direction === "rtl" ? "unset" : "auto",
                              mr: theme.direction !== "rtl" ? "unset" : "auto",
                            }}
                          >
                            <Box
                              sx={{
                                ...styles.centerV,
                                opacity: 0.8,
                                px: 0.4,
                                marginRight:
                                  theme.direction === "ltr" ? 2 : "unset",
                                marginLeft:
                                  theme.direction === "rtl" ? 2 : "unset",
                              }}
                            >
                              <EventBusyRoundedIcon
                                fontSize="small"
                                sx={{
                                  marginRight:
                                    theme.direction === "ltr" ? 0.5 : "unset",
                                  marginLeft:
                                    theme.direction === "rtl" ? 0.5 : "unset",
                                }}
                              />
                              <Typography variant="body2">
                                  {theme.direction == "rtl" ? formatDate(inviteExpirationDate, "Shamsi") : formatDate(inviteExpirationDate, "Miladi")}
                              </Typography>
                            </Box>
                            <MemberActions
                              query={queryData.query}
                              inviteeQuery={inviteeQueryData.query}
                              userId={id}
                              isInvitationExpired={true}
                              email={email}
                            />
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              );
            }}
          />
        )}
      </Box>
    </>
  );
};

export default ExpertGroupContainer;
