import {
  Avatar,
  Box,
  Button,
  CardHeader,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { styles } from "../../config/styles";
import Title from "../shared/Title";
import ThumbUpOffAltRoundedIcon from "@mui/icons-material/ThumbUpOffAltRounded";
import ProfilesListContainer from "./ProfilesListContainer";
import { useServiceContext } from "../../providers/ServiceProvider";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "../../utils/useQuery";
import QueryData from "../shared/QueryData";
import formatDate from "../../utils/formatDate";
import { Trans } from "react-i18next";
import RichEditor from "../shared/rich-editor/RichEditor";
import AssessmentCEFromDialog from "../assessments/AssessmentCEFromDialog";
import useDialog from "../../utils/useDialog";
import AlertBox from "../shared/AlertBox";
import { LoadingButton } from "@mui/lab";
import SupTitleBreadcrumb from "../shared/SupTitleBreadcrumb";
import { t } from "i18next";
import useDocumentTitle from "../../utils/useDocumentTitle";
import setDocumentTitle from "../../utils/setDocumentTitle";

const ProfileContainer = () => {
  const { service } = useServiceContext();
  const { profileId } = useParams();
  const profileQueryData = useQuery({
    service: (args = { id: profileId }, config) =>
      service.fetchProfile(args, config),
  });

  return (
    <QueryData
      {...profileQueryData}
      render={(data) => {
        setDocumentTitle(`${t("profile")}: ${data.title || ""}`);
        return <Profile data={data} query={profileQueryData.query} />;
      }}
    />
  );
};

const Profile = (props: any) => {
  const { data, query } = props;
  const { profileId } = useParams();
  const {
    title,
    tags = [],
    summary = "",
    about = "",
    likes_number = 0,
    expert_group = {},
    creation_time,
    last_modification_date,
    number_of_assessment,
    subjects_with_desc = [],
    questionnaires = [],
    is_active,
  } = data || {};

  const dialogProps = useDialog({
    context: {
      type: "create",
      staticData: { profile: { id: profileId, title } },
    },
  });

  return (
    <Box>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: { xs: "350px", sm: "340px" },
          top: 0,
          left: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: { xs: "10%", sm: "20%", md: "40%" },
          borderBottomRightRadius: { xs: "10%", sm: "20%", md: "40%" },
          backgroundColor: "#4568dc",
          background: "linear-gradient(to right, #4568dc, #b06ab3)",
          boxShadow: 15,
          overflowX: "hidden",
          zIndex: 2,
        }}
      />
      <Box
        sx={{
          position: "relative",
          zIndex: 3,
          maxHeight: "260px",
          overflow: "hidden",
        }}
      >
        <Box sx={{ color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Title
              size="large"
              sup={
                <SupTitleBreadcrumb
                  color="white"
                  routes={[
                    {
                      title: t("profiles") as string,
                      to: `/profiles`,
                    },
                  ]}
                />
              }
              sub={
                <Box
                  sx={{
                    ...styles.centerV,
                    fontSize: ".95rem",
                    mt: 0.5,
                    textTransform: "none",
                    opacity: 0.9,
                  }}
                >
                  {tags.map((tag: any) => (
                    <Chip
                      key={tag.id}
                      label={tag.title}
                      size="small"
                      sx={{ mr: 0.4, background: "white" }}
                    />
                  ))}
                </Box>
              }
            >
              {title}
            </Title>
            <Box
              sx={{
                borderRadius: 2,
                opacity: 1,
                position: "relative",
                display: "flex",
                alignItems: "center",
                ml: "auto",
                textDecoration: "none",
              }}
              component={Link}
              to={`/account/expert-groups/${expert_group.id}`}
            >
              <CardHeader
                titleTypographyProps={{
                  sx: { textDecoration: "none" },
                  color: "white",
                }}
                avatar={<Avatar alt={expert_group?.name || "E"} src={"/"} />}
                title={
                  <Box component={"b"} fontSize=".95rem">
                    {expert_group?.name}
                  </Box>
                }
              />
            </Box>
          </Box>
          <Box sx={{ ...styles.centerCVH, mt: 3 }}>
            <Box>
              <Typography variant="subtitle2">{summary}</Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", mt: 1 }}>
              <Box
                sx={{
                  py: 0.3,
                  px: 0.8,
                  background: "white",
                  color: "gray",
                  fontSize: ".8rem",
                  borderRadius: 1,
                  m: 0.2,
                }}
              >
                <Trans i18nKey="used" />:{" "}
                <Box component="span" color="black" textTransform={"lowercase"}>
                  {number_of_assessment} <Trans i18nKey="times" />
                </Box>
              </Box>
              <Box
                sx={{
                  py: 0.3,
                  px: 0.8,
                  background: "white",
                  color: "gray",
                  fontSize: ".8rem",
                  borderRadius: 1,
                  m: 0.2,
                }}
              >
                <Trans i18nKey="created" />:{" "}
                <Box component="span" color="black">
                  {formatDate(creation_time)}
                </Box>
              </Box>
              <Box
                sx={{
                  py: 0.3,
                  px: 0.8,
                  background: "white",
                  color: "gray",
                  fontSize: ".8rem",
                  borderRadius: 1,
                  m: 0.2,
                }}
              >
                <Trans i18nKey="updated" />:{" "}
                <Box component="span" color="black">
                  {formatDate(last_modification_date)}
                </Box>
              </Box>
            </Box>
            <LikeProfile likes_number={likes_number} />
          </Box>
        </Box>
      </Box>
      <Box mt={15}>
        {!is_active && (
          <Box my={5}>
            <AlertBox severity="warning">
              <Trans i18nKey="sorryYouCanCreateAssessmentWithThisProfile" />
            </AlertBox>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={3}>
            <Box sx={{ height: "100%" }}>
              <Title>
                <Trans i18nKey="tryIt" />
              </Title>
              <Box
                sx={{
                  background: "#eaf2f5",
                  borderRadius: 2,
                  py: 2.5,
                  px: 2.5,
                  position: "sticky",
                  top: "80px",
                  mt: 2,
                }}
              >
                <Box
                  sx={{ ...styles.centerV, justifyContent: "space-between" }}
                >
                  <Typography variant="body2">
                    <Trans i18nKey="price" />:
                  </Typography>
                  <Typography fontWeight={"bold"}>FREE</Typography>
                </Box>
                <Box
                  sx={{ ...styles.centerV, justifyContent: "space-between" }}
                >
                  <Typography variant="body2">
                    <Trans i18nKey="numberOfSubjects" />:
                  </Typography>
                  <Typography fontWeight={"bold"}>
                    {subjects_with_desc.length || 0}
                  </Typography>
                </Box>
                <Box
                  sx={{ ...styles.centerV, justifyContent: "space-between" }}
                >
                  <Typography variant="body2">
                    <Trans i18nKey="numberOfQuestionnaires" />:
                  </Typography>
                  <Typography fontWeight={"bold"}>
                    {questionnaires.length || 0}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 6 }}
                  disabled={!is_active}
                  onClick={dialogProps.openDialog}
                >
                  <Trans i18nKey="createAssessment" />
                </Button>
                <AssessmentCEFromDialog {...dialogProps} onSubmitForm={query} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8} md={9}>
            {about && (
              <Box mt={8}>
                <Title>
                  <Trans i18nKey="about" />
                </Title>
                <Box mt={2}>
                  <RichEditor content={about} />
                </Box>
              </Box>
            )}
            <Box mb={8}>
              <Title>
                <Trans i18nKey={"subjects"} />
              </Title>
              <Box component="ul" mt={3}>
                {subjects_with_desc.map((subject: any) => {
                  return (
                    <Box component="li" mb={2} key={subject.id}>
                      <b>{subject.title}</b>: {subject.description}
                    </Box>
                  );
                })}
              </Box>
            </Box>
            <Box mb={8}>
              <Title>
                <Trans i18nKey="questionnaires" />
              </Title>
              <Box component="ul" mt={3}>
                {questionnaires.map((questionnaire: any) => {
                  return (
                    <Box component="li" mb={2} key={questionnaire.id}>
                      <b>{questionnaire.title}</b>: {questionnaire.description}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const LikeProfile = ({ likes_number }: any) => {
  const { service } = useServiceContext();
  const { profileId } = useParams();
  const likeQueryData = useQuery({
    service: (args = { id: profileId }, config) =>
      service.likeProfile(args, config),
    runOnMount: false,
  });

  const like = async () => {
    const res = await likeQueryData.query();
  };

  return (
    <LoadingButton
      sx={{
        ...styles.centerV,
        mt: 1.5,
        fontSize: ".95rem",
        textTransform: "none",
        ml: 0.5,
        color: "white",
        py: 0.2,
      }}
      variant="contained"
      color="secondary"
      size="small"
      startIcon={<ThumbUpOffAltRoundedIcon fontSize="inherit" />}
      onClick={like}
      loading={likeQueryData.loading}
    >
      <Box sx={{ mx: 0.6 }}>{likeQueryData?.data?.likes || likes_number}</Box>
    </LoadingButton>
  );
};

export default ProfileContainer;
