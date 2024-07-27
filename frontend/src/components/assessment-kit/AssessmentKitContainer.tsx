import {
  Avatar,
  Box,
  Button,
  CardHeader,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { styles, getMaturityLevelColors } from "@styles";
import Title from "@common/Title";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import AssessmentKitsListContainer from "./AssessmentKitsListContainer";
import { useServiceContext } from "@providers/ServiceProvider";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import QueryData from "@common/QueryData";
import formatDate from "@utils/formatDate";
import { Trans } from "react-i18next";
import RichEditor from "@common/rich-editor/RichEditor";
import AssessmentCEFromDialog from "../assessments/AssessmentCEFromDialog";
import useDialog from "@utils/useDialog";
import AlertBox from "@common/AlertBox";
import { LoadingButton } from "@mui/lab";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import { t } from "i18next";
import useDocumentTitle from "@utils/useDocumentTitle";
import setDocumentTitle from "@utils/setDocumentTitle";
import { useConfigContext } from "@/providers/ConfgProvider";

const AssessmentKitContainer = () => {
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();
  const assessmentKitQueryData = useQuery({
    service: (args = { id: assessmentKitId }, config) =>
      service.fetchAssessmentKit(args, config),
  });
  const { config } = useConfigContext();

  return (
    <QueryData
      {...assessmentKitQueryData}
      render={(data) => {
        setDocumentTitle(
          `${t("assessmentKit")}: ${data.title || ""}`,
          config.appTitle
        );
        return (
          <AssessmentKit data={data} query={assessmentKitQueryData.query} />
        );
      }}
    />
  );
};

const AssessmentKit = (props: any) => {
  const { data, query } = props;
  const { assessmentKitId } = useParams();

  const {
    title,
    summary = "",
    about = "",
    published,
    isPrivate,
    creationTime,
    lastModificationTime,
    expertGroupId,
    like,
    assessmentsCount,
    subjectsCount,
    questionnairesCount,
    subjects = [],
    questionnaires = [],
    maturityLevels,
    tags = [],

    // expert_group = {},
  } = data || {};
  const { service } = useServiceContext();
  const expertGroupQueryData = useQuery({
    service: (args = { id: expertGroupId }, config) =>
      service.fetchUserExpertGroup(args, config),
  });
  const colorPallet = getMaturityLevelColors(
    maturityLevels ? maturityLevels?.length : 5
  );
  const dialogProps = useDialog({
    context: {
      type: "create",
      staticData: { assessment_kit: { id: assessmentKitId, title } },
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
              size="medium"
              sup={
                <SupTitleBreadcrumb
                  color="white"
                  mouseCursor="pointer"
                  routes={[
                    {
                      title: t("assessmentKits") as string,
                      to: `/assessment-kits`,
                      disabled: false,
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
            <QueryData
              {...expertGroupQueryData}
              loading={false}
              render={(data) => {
                const { title, id, pictureLink } = data;
                return (
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
                    to={`/user/expert-groups/${id}`}
                  >
                    <CardHeader
                      titleTypographyProps={{
                        sx: { textDecoration: "none" },
                        color: "white",
                      }}
                      avatar={<Avatar alt={title} src={pictureLink} />}
                      title={
                        <Box component={"b"} fontSize=".95rem">
                          {title}
                        </Box>
                      }
                    />
                  </Box>
                );
              }}
            />
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
                  {assessmentsCount} <Trans i18nKey="times" />
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
                  {formatDate(creationTime)}
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
                  {formatDate(lastModificationTime)}
                </Box>
              </Box>
            </Box>
            <LikeAssessmentKit likes={like} />
          </Box>
        </Box>
      </Box>
      <Box mt={15}>
        {!published && (
          <Box my={5}>
            <AlertBox severity="warning">
              <Trans i18nKey="sorryYouCanCreateAssessmentWithThisAssessmentKit" />
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
                    {subjectsCount || 0}
                  </Typography>
                </Box>
                <Box
                  sx={{ ...styles.centerV, justifyContent: "space-between" }}
                >
                  <Typography variant="body2">
                    <Trans i18nKey="numberOfQuestionnaires" />:
                  </Typography>
                  <Typography fontWeight={"bold"}>
                    {questionnairesCount || 0}
                  </Typography>
                </Box>
                <Box
                  sx={{ ...styles.centerV, justifyContent: "space-between" }}
                >
                  <Typography variant="body2">
                    <Trans i18nKey="numberOfMaturityLevels" />:
                  </Typography>
                  <Typography fontWeight={"bold"}>
                    {maturityLevels?.length || 0}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 6 }}
                  disabled={!published}
                  onClick={dialogProps.openDialog}
                >
                  <Trans i18nKey="createAssessment" />
                </Button>
                <AssessmentCEFromDialog
                  {...dialogProps}
                  onSubmitForm={undefined}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8} md={9}>
            {about && (
              <Box mb={8}>
                <Title>
                  <Trans i18nKey="about" />
                </Title>
                <Box mt={2}>
                  <RichEditor content={about} />
                </Box>
              </Box>
            )}
            {maturityLevels && (
              <Box mb={8}>
                <Title>
                  <Trans i18nKey="maturityLevels" />
                </Title>
                <Box mt={2} sx={{ display: "flex" }}>
                  {maturityLevels.map((item: any, index: number) => {
                    const colorCode = colorPallet[item.index - 1];
                    return (
                      <Box
                        sx={{
                          background: colorCode,
                          fontSize: "1rem",
                          py: { xs: "0.16rem", md: 1 },
                          px: { xs: 1, md: 4 },
                          fontWeight: "bold",
                          color: "#fff",
                          borderRadius:
                            index === 0
                              ? "8px 0 0 8px"
                              : index === maturityLevels?.length - 1
                                ? "0 8px 8px 0"
                                : "0",
                        }}
                      >
                        {item.title}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
            <Box mb={8}>
              <Title>
                <Trans i18nKey={"subjects"} />
              </Title>
              <Box component="ul" mt={3}>
                {subjects.map((subject: any) => {
                  return (
                    <Box
                      component="li"
                      mb={2}
                      key={subject.id}
                      sx={{ fontSize: "1.2rem" }}
                    >
                      <b>{subject.title}</b>: {subject.description}
                      <Typography fontWeight="bold" sx={{ ml: 2, mt: 2 }}>
                        <Trans i18nKey="relatedAttributes" />
                      </Typography>
                      {subject?.attributes &&
                        subject?.attributes?.map((att: any) => (
                          <Box sx={{ ml: 4 }} component="li">
                            <Typography
                              variant="body2"
                              sx={{
                                my: 2,
                                textAlign: "justify",
                                textJustify: "inter-word",
                              }}
                            >
                              <Box
                                component="span"
                                fontSize="1rem"
                                fontWeight="bold"
                              >
                                {att.title}
                              </Box>
                              :{" "}
                              <Box component="span" fontSize="1rem">
                                {att.description}
                              </Box>
                            </Typography>
                          </Box>
                        ))}
                    </Box>
                  );
                })}
              </Box>
            </Box>
            <Box mb={8}>
              <Title>
                <Trans i18nKey="questionnaires" />
              </Title>
              <Typography variant="body2" fontSize="1rem">
                <Trans i18nKey="questionnairesAssessmentKitDescription" values={{ questionnairesCount }} />
              </Typography>
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

const LikeAssessmentKit = ({ likes }: any) => {
  const { service } = useServiceContext();
  const { assessmentKitId } = useParams();
  const likeQueryData = useQuery({
    service: (args = { id: assessmentKitId }, config) =>
      service.likeAssessmentKit(args, config),
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
      startIcon={
        likeQueryData?.data?.liked ?? likes?.liked ? (
          <FavoriteRoundedIcon />
        ) : (
          <FavoriteBorderRoundedIcon fontSize="inherit" />
        )
      }
      onClick={like}
      loading={likeQueryData.loading}
    >
      <Box sx={{ mx: 0.6 }}>{likeQueryData?.data?.count ?? likes?.count}</Box>
    </LoadingButton>
  );
};

export default AssessmentKitContainer;
