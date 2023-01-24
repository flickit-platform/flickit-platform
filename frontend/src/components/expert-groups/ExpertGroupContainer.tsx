import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  InputAdornment,
  Link as MLink,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import QueryData from "../shared/QueryData";
import Title from "../shared/Title";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import { styles } from "../../config/styles";
import { Trans } from "react-i18next";
import RichEditor from "../shared/rich-editor/RichEditor";
import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import { t } from "i18next";
import { IUserInfo, TQueryFunction } from "../../types";
import getUserName from "../../utils/getUserName";
import forLoopComponent from "../../utils/forLoop";
import { LoadingSkeleton } from "../shared/loadings/LoadingSkeleton";
import ProfileListItem from "../profile/ProfileListItem";
import toastError from "../../utils/toastError";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRef, useState } from "react";
import MinimizeRoundedIcon from "@mui/icons-material/MinimizeRounded";
import { ICustomError } from "../../utils/CustomError";
import useDialog from "../../utils/useDialog";
import ProfileCEFromDialog from "../profile/ProfileCEFromDialog";
import { toast } from "react-toastify";

const ExpertGroupContainer = () => {
  const { service } = useServiceContext();
  const { expertGroupId } = useParams();
  const queryData = useQuery({
    service: (args = { id: expertGroupId }, config) => service.fetchUserExpertGroup(args, {}),
  });

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
          number_of_profiles,
          users = [],
          bio,
          profiles = [],
        } = data || {};
        return (
          <Box>
            <Title borderBottom pb={1} avatar={<Avatar src={picture} sx={{ mr: 1 }} />} sub={bio}>
              {name}
            </Title>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={8}>
                {about && (
                  <>
                    <Title size="small">
                      <Trans i18nKey="about" />
                    </Title>
                    <Box sx={{ p: 3, mt: 1, borderRadius: 2, background: "white" }}>
                      <Box minHeight={"160px"} mb={4}>
                        <RichEditor content={about} />
                      </Box>
                    </Box>
                  </>
                )}
                <Box mt={5}>
                  <ProfilesList queryData={queryData} />
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box p={2} sx={{ borderRadius: 2, p: 3, background: "white", mt: 5 }}>
                  <Box>
                    <Typography variant="h6" display="flex" alignItems={"center"} sx={{ mb: 2 }}>
                      <Trans i18nKey="summary" />
                    </Typography>
                    {website && (
                      <Box sx={{ ...styles.centerV }}>
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
                          {website?.replace("https://", "").replace("http://", "")}
                        </MLink>
                      </Box>
                    )}
                    <Box sx={{ ...styles.centerV, mt: 2, fontSize: ".9rem" }}>
                      <PeopleRoundedIcon fontSize="small" sx={{ mr: 1, opacity: 0.8 }} />

                      <Typography
                        sx={{
                          opacity: 0.9,
                          fontSize: "inherit",
                        }}
                      >
                        {number_of_members} {t("members").toLowerCase()}
                      </Typography>
                    </Box>
                    <Box sx={{ ...styles.centerV, mt: 1, fontSize: ".9rem" }}>
                      <AssignmentRoundedIcon fontSize="small" sx={{ mr: 1, opacity: 0.8 }} />

                      <Typography
                        sx={{
                          opacity: 0.9,
                          fontSize: "inherit",
                        }}
                      >
                        {number_of_profiles} {t("profiles").toLowerCase()}
                      </Typography>
                    </Box>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                  </Box>
                  {/* --------------------------- */}
                  <Box>
                    <Typography variant="h6" display="flex" alignItems={"center"} sx={{ mb: 2 }}>
                      <Trans i18nKey="members" />
                    </Typography>
                    <AddingNewMember queryData={queryData} />
                    <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1.5 }}>
                      <AvatarGroup>
                        {users.map((user: IUserInfo) => {
                          const name = getUserName(user);
                          return <Avatar alt={name} title={name} src="/" />;
                        })}
                      </AvatarGroup>
                    </Box>
                    {/* <Divider sx={{ mt: 2, mb: 2 }} /> */}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      }}
    />
  );
};

const AddingNewMember = (props: any) => {
  const { queryData } = props;
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <Typography
        variant="h6"
        display="flex"
        alignItems={"center"}
        sx={{ mb: 2, fontSize: ".9rem", opacity: 0.8, cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      >
        <Trans i18nKey="addMember" />
        <Box
          sx={{
            ...styles.centerV,
            ml: "auto",
          }}
        >
          {open ? <MinimizeRoundedIcon fontSize="small" /> : <AddRoundedIcon fontSize="small" />}
        </Box>
      </Typography>
      <Collapse in={open}>
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
    toastError: true,
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
      console.log(e);
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
      sx={{ my: 0.5 }}
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
          endAdornment: <AddMemberButton loading={addMemberQueryData.loading} />,
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

const ProfilesList = (props: any) => {
  const { expertGroupId } = useParams();
  const { service } = useServiceContext();
  const profileQuery = useQuery({
    service: (args = { id: expertGroupId }, config) => service.fetchExpertGroupProfiles(args, config),
  });

  return (
    <>
      <Title size="small" toolbar={<CreateProfileButton onSubmitForm={profileQuery.query} />}>
        <Trans i18nKey={"profiles"} />
      </Title>
      <Box mt={2}>
        <QueryData
          {...profileQuery}
          renderLoading={() => (
            <>
              {forLoopComponent(5, (index) => (
                <LoadingSkeleton key={index} sx={{ height: "60px", mb: 1 }} />
              ))}
            </>
          )}
          render={(data = []) => {
            return (
              <>
                {data.map((profile: any) => {
                  return (
                    <ProfileListItem
                      link={`profiles/${profile?.id}`}
                      key={profile?.id}
                      data={profile}
                      fetchProfiles={profileQuery.query}
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

const CreateProfileButton = (props: { onSubmitForm: TQueryFunction }) => {
  const { onSubmitForm } = props;
  const { expertGroupId } = useParams();
  const dialogProps = useDialog({
    context: { type: "create", data: { expertGroupId } },
  });

  return (
    <>
      <Button variant="contained" size="small" onClick={dialogProps.openDialog}>
        <Trans i18nKey="createProfile" />
      </Button>
      <ProfileCEFromDialog {...dialogProps} onSubmitForm={onSubmitForm} />
    </>
  );
};

export default ExpertGroupContainer;
