import Title from "@common/Title";
import { useEffect, useMemo, useState } from "react";
import { Trans } from "react-i18next";
import AdviceSlider from "../common/AdviceSlider";
import Box from "@mui/material/Box";
import {
  Button,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Pagination,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import EmptyAdvice from "@assets/svg/lampComment.svg";
import Setting from "@assets/svg/setting.svg";
import StarsAdvice from "@assets/svg/Stars.svg";
import BetaSvg from "@assets/svg/beta.svg";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { ISubjectReportModel, TId } from "@types";
import { useServiceContext } from "@providers/ServiceProvider";
import toastError from "@utils/toastError";
import { ICustomError } from "@utils/CustomError";
import languageDetector from "@utils/languageDetector";
import { LoadingButton } from "@mui/lab";
import useScreenResize from "@utils/useScreenResize";
import { primaryFontFamily, secondaryFontFamily, theme } from "@/config/theme";
import { styles } from "@/config/styles";
import { InfoOutlined } from "@mui/icons-material";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { AssessmentInsight } from "./AssessmentInsight";
import { AssessmentReportNarrator } from "@components/assessment-report/assessmentReportNarrator";
import AdviceDialog from "./AdviceDialog";
import QueryBatchData from "../common/QueryBatchData";

const AssessmentAdviceContainer = (props: any) => {
  const { subjects, assessment, permissions } = props;
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isWritingAdvice, setIsWritingAdvice] = useState<boolean>(false);
  const [adviceResult, setAdviceResult] = useState<any>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [AIGenerated, setAIGenerated] = useState<boolean>(false);
  const [emptyState, setEmptyState] = useState<boolean>(true);

  const { assessmentId = "" } = useParams();

  const { service } = useServiceContext();
  const itemsPerPage = 5;
  const totalPages = useMemo(
    () => Math.ceil(adviceResult?.length / itemsPerPage),
    [adviceResult],
  );
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };
  const paginatedAdvice = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return adviceResult?.slice(startIndex, endIndex);
  }, [adviceResult, currentPage]);
  const handleClickOpen = () => {
    setExpanded(true);
  };

  const handleClose = () => {
    setExpanded(false);
  };
  // { subjectId: string; assessmentId: string }
  const subjectQueryData = useQuery<ISubjectReportModel>({
    service: (args, config) => service.fetchSubject(args, config),
    runOnMount: false,
  });
  const createAdviceQueryData = useQuery<ISubjectReportModel>({
    service: (args, config) => service.createAdvice(args, config),
    runOnMount: false,
  });
  const createAINarrationQueryData = useQuery<ISubjectReportModel>({
    service: (args, config) => service.createAINarration(args, config),
    runOnMount: false,
  });

  const fetchAdviceNarration = useQuery<any>({
    service: (args, config) =>
      service.fetchAdviceNarration({ assessmentId }, config),
    toastError: false,
  });
  const createAdvice = async () => {
    try {
      if (target) {
        const data = await createAdviceQueryData.query({
          assessmentId: assessmentId,
          attributeLevelTargets: target,
        });
        setAdviceResult(data?.items);
        setIsFarsi(languageDetector(data?.items[0]?.question?.title));
        handleClose();
      }
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  const generateAdviceViaAI = async () => {
    try {
      if (target) {
        const data = await createAINarrationQueryData.query({
          assessmentId: assessmentId,
          attributeLevelTargets: target,
          adviceListItems: adviceResult,
        });
        setAdviceResult(null);
        setAIGenerated(true);
        setIsWritingAdvice(false);
        handleClose();
      }
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
    }
  };
  const [subjectData, setsubjectData] = useState<any>([]);
  const [target, setTarget] = useState<any>([]);
  const [isFarsi, setIsFarsi] = useState<boolean>(false);
  const attributeColorPallet = ["#D81E5B", "#F9A03F", "#0A2342"];
  const attributeBGColorPallet = ["#FDF1F5", "#FEF5EB", "#EDF4FC"];
  const fullScreen = useScreenResize("sm");
  const filteredMaturityLevels = useMemo(() => {
    const filteredData = assessment?.assessmentKit?.maturityLevels.sort(
      (elem1: any, elem2: any) => elem1.index - elem2.index,
    );
    return filteredData;
  }, [assessment]);

  return (
    <QueryBatchData
      queryBatchData={[fetchAdviceNarration]}
      renderLoading={() => <Skeleton height={160} />}
      render={([narrationComponent]) => {
        useEffect(() => {
          const adviceEmptyState = !(
            narrationComponent?.aiNarration ||
            narrationComponent?.assessorNarration
          );
          setEmptyState(adviceEmptyState);
        }, []);
        return (
          <>
            <AdviceDialog
              open={expanded}
              handleClose={handleClose}
              subjects={subjects}
              target={target}
              setTarget={setTarget}
              filteredMaturityLevels={filteredMaturityLevels}
              createAdvice={createAdvice}
              loading={createAdviceQueryData.loading}
            />
            {emptyState && !isWritingAdvice && !AIGenerated ? (
              <Box
                sx={{
                  borderRadius: "12px",
                  border: `${adviceResult || isWritingAdvice ? "none" : "1px solid #9DA7B3"}`,
                  p: 6,
                  margin: "0 auto",
                  display: `${adviceResult || isWritingAdvice ? "none" : ""}`,
                  position: "relative",
                  background: "radial-gradient(circle, #2466A8, #1B4D7E)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)", // Center the lamp
                  }}
                >
                  <img src={EmptyAdvice} alt="lamp" width="100%" />
                </Box>

                {/* Stars aligned to the top right */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                  }}
                >
                  <img src={StarsAdvice} alt="stars" width="100%" />
                </Box>

                <Box
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 12,
                  }}
                >
                  {" "}
                  <Typography
                    variant="headlineMedium"
                    color="primary.contrastText"
                  >
                    <Trans i18nKey="noAdviceGeneratedYet" />
                  </Typography>
                </Box>
                {permissions?.createAdvice && (
                  <Box
                    sx={{
                      ...styles.centerCVH,
                      mt: 4,
                    }}
                    textAlign="center"
                  >
                    <Typography
                      variant="bodyLarge"
                      color="primary.contrastText"
                      maxWidth="50vw"
                    >
                      <Trans i18nKey="theAdvisorService" />
                    </Typography>
                  </Box>
                )}
                {/* Button */}
                {permissions?.createAdvice && (
                  <Box
                    sx={{
                      display: `${adviceResult ? "none" : "flex"}`,
                      justifyContent: "center",
                      alignItems: "center",
                      mt: 3,
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "white",
                        color: "white",
                        "&:hover": {
                          borderColor: "#d9dde3",
                          color: "#d9dde3",
                        },
                      }}
                      onClick={() => setIsWritingAdvice(true)}
                    >
                      <Trans i18nKey="writeYourOwnAdvices" />
                    </Button>{" "}
                    <Tooltip
                      title={
                        !narrationComponent.aiEnabled && (
                          <Trans i18nKey="AIDisabled" />
                        )
                      }
                    >
                      <div>
                        <Button
                          variant="outlined"
                          sx={{
                            background: "white",
                            "&:hover": {
                              background: "#d9dde3",
                            },
                            display: "flex",
                            gap: 1,
                          }}
                          onClick={handleClickOpen}
                          disabled={!narrationComponent.aiEnabled}
                        >
                          <Trans i18nKey="useAdviceGenerator" />
                          <FaWandMagicSparkles />
                        </Button>
                      </div>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            ) : (
              !adviceResult && (
                <>
                  <AssessmentReportNarrator
                    isWritingAdvice={isWritingAdvice}
                    setIsWritingAdvice={setIsWritingAdvice}
                    setEmptyState={setEmptyState}
                    setAIGenerated={setAIGenerated}
                  />
                  {permissions?.createAdvice && !isWritingAdvice && (
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Tooltip
                        title={
                          !narrationComponent.aiEnabled && (
                            <Trans i18nKey="AIDisabled" />
                          )
                        }
                      >
                        <div>
                          <Button
                            variant="contained"
                            sx={{
                              display: "flex",
                              gap: 1,
                            }}
                            onClick={handleClickOpen}
                            disabled={!narrationComponent.aiEnabled}
                          >
                            <Trans
                              i18nKey={
                                AIGenerated
                                  ? "regenerate"
                                  : "useAdviceGenerator"
                              }
                            />
                            <FaWandMagicSparkles />
                          </Button>
                        </div>
                      </Tooltip>
                    </Box>
                  )}
                </>
              )
            )}
            {adviceResult && (
              <>
                {/* List header */}
                <Grid
                  container
                  spacing={2}
                  sx={{
                    mb: 4,
                    textAlign: "center",
                    fontWeight: "700",
                    color: "#9DA7B3",
                  }}
                >
                  <Grid item xs={1} md={1}>
                    <Trans i18nKey="index" />
                  </Grid>
                  <Grid item xs={5} md={3}>
                    <Trans i18nKey="question" />
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <Trans i18nKey="whatIsNow" />
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <Trans i18nKey="whatShouldBe" />
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <Trans i18nKey="targetedAttributes" />
                  </Grid>
                  <Grid
                    item
                    xs={0}
                    md={2}
                    sx={{
                      display: {
                        md: "block",
                        xs: "none",
                      },
                    }}
                  >
                    <Trans i18nKey="questionnaire" />
                  </Grid>
                </Grid>

                {/* Paginated list items */}
                {paginatedAdvice?.map((item: any, index: number) => {
                  const {
                    question,
                    answeredOption,
                    recommendedOption,
                    attributes,
                    questionnaire,
                  } = item;
                  return (
                    <Grid
                      container
                      spacing={2}
                      sx={{ alignItems: "center", mb: 2 }}
                      key={index}
                    >
                      <Grid
                        item
                        xs={1}
                        md={1}
                        sx={{
                          textAlign: "center",
                          fontWeight: "700",
                          color: "#004F83",
                        }}
                      >
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </Grid>
                      <Grid
                        item
                        xs={5}
                        md={3}
                        sx={{
                          alignItems: "center",
                          textAlign: { xs: "left", md: "left" },
                          fontWeight: "700",
                          color: "#0A2342",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: 3,
                          whiteSpace: "normal",
                        }}
                      >
                        <Tooltip
                          title={
                            question?.title.length > 100 ? question?.title : ""
                          }
                        >
                          <Box>{question?.title}</Box>
                        </Tooltip>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        md={2}
                        sx={{
                          textAlign: "center",
                          fontWeight: "300",
                          color: "#0A2342",
                        }}
                      >
                        {answeredOption &&
                          `${answeredOption.index}. ${answeredOption.title}`}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        md={2}
                        sx={{
                          textAlign: "center",
                          fontWeight: "300",
                          color: "#0A2342",
                        }}
                      >
                        {recommendedOption &&
                          `${recommendedOption.index}. ${recommendedOption.title}`}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        md={2}
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        {attributes.map((attribute: any, index: number) => (
                          <Box
                            key={attribute.id}
                            sx={{
                              px: "10px",
                              color: attributeColorPallet[Math.ceil(index % 3)],
                              background:
                                attributeBGColorPallet[Math.ceil(index % 3)],
                              fontSize: "11px",
                              border: `1px solid ${attributeColorPallet[Math.ceil(index % 3)]}`,
                              borderRadius: "8px",
                              m: "4px",
                              textAlign: "center",
                              fontFamily: `${isFarsi ? "Vazirmatn" : primaryFontFamily}`,
                            }}
                          >
                            {attribute.title}
                          </Box>
                        ))}
                      </Grid>
                      <Grid
                        item
                        xs={0}
                        md={2}
                        sx={{
                          textAlign: "center",
                          fontWeight: "500",
                          color: "#004F83",
                          display: { md: "block", xs: "none" },
                        }}
                      >
                        <Box>{questionnaire.title}</Box>
                        <Box>Q.{question?.index}</Box>
                      </Grid>
                    </Grid>
                  );
                })}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 4,
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                  {permissions?.createAdvice && (
                    <LoadingButton
                      variant="contained"
                      sx={{
                        display: "flex",
                        gap: 1,
                      }}
                      onClick={generateAdviceViaAI}
                      loading={createAINarrationQueryData.loading}
                    >
                      <Trans i18nKey="generateAdviceViaAI" />
                      <FaWandMagicSparkles />
                    </LoadingButton>
                  )}
                </Box>
              </>
            )}
          </>
        );
      }}
    />
  );
};

export default AssessmentAdviceContainer;
