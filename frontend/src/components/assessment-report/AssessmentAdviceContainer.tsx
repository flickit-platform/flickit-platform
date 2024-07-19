import Title from "@common/Title";
import { useEffect, useMemo, useState } from "react";
import { Trans } from "react-i18next";
import AdviceSlider from "../common/AdviceSlider";
import Box from "@mui/material/Box";
import { Button, Divider, Grid, IconButton, Tooltip } from "@mui/material";
import EmptyAdvice from "@assets/img/emptyAdvice.gif";
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
import { customFontFamily } from "@/config/theme";
const AssessmentAdviceContainer = (props: any) => {
  const { subjects, assessment } = props;
  const [expanded, setExpanded] = useState<boolean>(false);
  const [adviceResult, setAdviceResult] = useState<any>();
  const { assessmentId } = useParams();

  const { service } = useServiceContext();
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
  const [subjectData, setsubjectData] = useState<any>([]);
  const [target, setTarget] = useState<any>([]);
  const [isFarsi, setIsFarsi] = useState<boolean>(false);
  const attributeColorPallet = ["#D81E5B", "#F9A03F", "#0A2342"];
  const attributeBGColorPallet = ["#FDF1F5", "#FEF5EB", "#EDF4FC"];
  const fullScreen = useScreenResize("sm");
  const filteredMaturityLevels = useMemo(() => {
    const filteredData = assessment?.assessmentKit?.maturityLevels.sort(
      (elem1: any, elem2: any) => elem1.index - elem2.index
    );
    return filteredData;
  }, [assessment]);
  return (
    <div>
      <Dialog
        open={expanded}
        onClose={handleClose}
        maxWidth={"md"}
        fullScreen={fullScreen}
        fullWidth
        sx={{
          ".MuiDialog-paper": {
            borderRadius: { xs: 0, sm: "32px" },
          },
          ".MuiDialog-paper::-webkit-scrollbar": {
            display: "none",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
        }}
      >
        <DialogContent
          sx={{
            padding: "0!important",
            background: "#004F83",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <Box
              sx={{
                background: "#004F83",
                py: 4,
                textAlign: "center",
                color: "#fff",
                fontSize: "2rem",
                fontWeight: "700",
                borderRadius: "32px 32px 0 0",
              }}
            >
              <Trans i18nKey="setYourGoals" />
            </Box>
            <Box
              sx={{
                background: "#EDF4FC",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  color: "#6C7B8E",
                  fontSize: "1rem",
                  fontWeight: "500",
                  display: "flex",
                  textAlign: "center",
                  width: { xs: "100%", sm: "50%" },
                  py: 2,
                }}
              >
                <Trans i18nKey="wichAttYouWant" />
              </Box>
              {/*
              <Box
                sx={{
                  display: "flex",
                  width: "fit-content",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: "16px",
                  my: 4,
                }}
              >
                {subjects.map((subject: any) => {
                  const fetchAttributes = async (id: TId) => {
                    try {
                      const data = await subjectQueryData.query({
                        subjectId: id,
                        assessmentId: assessmentId,
                      });
                      setsubjectData((prev: any) => [...prev, data]);
                    } catch (e) {}
                  };
                  useEffect(() => {
                    if (subject.id) {
                      fetchAttributes(subject.id);
                    }
                  }, [subject]);
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      <Box sx={{             fontSize: "1rem",
, fontWeight: "700" }}>
                        {subject.title}
                      </Box> 
                       <Divider sx={{ my: 2 }} /> 
                      <Box>
                         <FormGroup>
                          {subjectData.map((subject: any) => {
                            subject?.attributes.map((attribute: any) => {
                              return (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      sx={{
                                        color: "#0A2342",
                                        "&.Mui-checked": {
                                          color: "#004F83",
                                        },
                                      }}
                                    />
                                  }
                                  label={attribute.title}
                                />
                              );
                            });
                          })}
                        </FormGroup> 
                      </Box>
                    </Box>
                  );
                })}
              </Box>
*/}
            </Box>
            <Box
              sx={{
                borderRadius: { xs: 0, sm: "0 0 32px 32px" },
                background: "#fff",
                py: 8,
                maxHeight: "60vh",
                overflow: "auto",
                overflowX: "hidden",
              }}
            >
              {subjects.map((subject: any) =>
                subject?.attributes.map((attribute: any) => (
                  <AdviceSlider
                    key={attribute.id}
                    defaultValue={attribute?.maturityLevel?.value || 0}
                    currentState={attribute?.maturityLevel}
                    attribute={attribute}
                    subject={subject}
                    maturityLevels={filteredMaturityLevels}
                    target={target}
                    setTarget={setTarget}
                  />
                ))
              )}

              <Box
                sx={{ mt: "64px", display: "flex", justifyContent: "center" }}
              >
                <Button
                  sx={{
                    color: "#004F83",
                    px: 2,
                    py: 1,
                    borderRadius: "16px",
                    fontSize: "1rem",
                    fontWeight: "700",
                    width: "fit-content",
                    mr: 2,
                  }}
                  onClick={handleClose}
                >
                  <Trans i18nKey="cancel" />
                </Button>

                <LoadingButton
                  sx={{
                    background: "#004F83",
                    color: "#EDFCFC",
                    px: 2,
                    py: 1,
                    borderRadius: "16px",
                    fontSize: "1rem",
                    fontWeight: "700",
                    width: "fit-content",
                    "&:hover": {
                      backgroundColor: "rgba(28, 194, 196, 0.5)",
                    },
                  }}
                  variant="contained"
                  color="secondary"
                  onClick={createAdvice}
                  loading={createAdviceQueryData.loading}
                >
                  <Trans i18nKey="setTheseParameters" />
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <Box mt={6}>
        <Box
          sx={{
            borderRadius: "24px",
            border: `${adviceResult ? "none" : "1px solid #9DA7B3 "}`,
            width: { xs: "100%", sm: "60%" },
            p: 6,
            margin: "0 auto",
          }}
        >
          <Box
            sx={{
              fontSize: "4rem",
              fontWeight: "700",
              color: "#004F83",
              textShadow: "0px 0px 11.2px rgba(28, 194, 196, 0.50)",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Trans i18nKey="advisor" />
            <Box sx={{ ml: 2 }}>
              <img src={BetaSvg} alt="beta" />
            </Box>
          </Box>

          <Box
            sx={{
              fontSize: "1rem",
              fontWeight: "400",
              color: "#0A2342",
              margin: "0 auto",
            }}
          >
            <Trans i18nKey="theAdvisorService" />
          </Box>
          <Box
            sx={{
              margin: "0 auto",
              width: "50%",
              display: `${adviceResult ? "none" : "flex"}`,
            }}
          >
            <img src={EmptyAdvice} alt="advice" width="100%" />
          </Box>
          <Box
            sx={{
              display: `${adviceResult ? "none" : "flex"}`,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              sx={{
                background: "#004F83",
                color: "#EDFCFC",
                px: 5,
                py: 1,
                borderRadius: "16px",
                fontSize: "1rem",
                fontWeight: "700",
                width: "fit-content",
                "&:hover": {
                  backgroundColor: "rgba(28, 194, 196, 0.5)",
                },
              }}
              onClick={handleClickOpen}
            >
              <Trans i18nKey="createYourFirstAdvice" />
            </Button>
          </Box>
        </Box>
        {adviceResult && (
          <>
            <Box
              sx={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#0A2342",
                textShadow: "0px 0px 11.2px rgba(10, 35, 66, 0.30)",
                textAlign: "left",
                display: "flex",
                justifyContent: "center",
                mb: 6,
              }}
            >
              <Trans i18nKey="advicesList" />

              <IconButton
                title="Edit"
                edge="end"
                sx={{
                  ml: 2,
                }}
                onClick={handleClickOpen}
              >
                <svg
                  width="31"
                  height="31"
                  viewBox="0 0 31 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.674988 25.5C0.674988 26.4167 1.42499 27.1667 2.34165 27.1667H10.675V23.8333H2.34165C1.42499 23.8333 0.674988 24.5833 0.674988 25.5ZM0.674988 5.5C0.674988 6.41667 1.42499 7.16667 2.34165 7.16667H17.3417V3.83333H2.34165C1.42499 3.83333 0.674988 4.58333 0.674988 5.5ZM17.3417 28.8333V27.1667H29.0083C29.925 27.1667 30.675 26.4167 30.675 25.5C30.675 24.5833 29.925 23.8333 29.0083 23.8333H17.3417V22.1667C17.3417 21.25 16.5917 20.5 15.675 20.5C14.7583 20.5 14.0083 21.25 14.0083 22.1667V28.8333C14.0083 29.75 14.7583 30.5 15.675 30.5C16.5917 30.5 17.3417 29.75 17.3417 28.8333ZM7.34165 12.1667V13.8333H2.34165C1.42499 13.8333 0.674988 14.5833 0.674988 15.5C0.674988 16.4167 1.42499 17.1667 2.34165 17.1667H7.34165V18.8333C7.34165 19.75 8.09165 20.5 9.00832 20.5C9.92499 20.5 10.675 19.75 10.675 18.8333V12.1667C10.675 11.25 9.92499 10.5 9.00832 10.5C8.09165 10.5 7.34165 11.25 7.34165 12.1667ZM30.675 15.5C30.675 14.5833 29.925 13.8333 29.0083 13.8333H14.0083V17.1667H29.0083C29.925 17.1667 30.675 16.4167 30.675 15.5ZM22.3417 10.5C23.2583 10.5 24.0083 9.75 24.0083 8.83333V7.16667H29.0083C29.925 7.16667 30.675 6.41667 30.675 5.5C30.675 4.58333 29.925 3.83333 29.0083 3.83333H24.0083V2.16667C24.0083 1.25 23.2583 0.5 22.3417 0.5C21.425 0.5 20.675 1.25 20.675 2.16667V8.83333C20.675 9.75 21.425 10.5 22.3417 10.5Z"
                    fill="black"
                  />
                </svg>
              </IconButton>
            </Box>

            {/* list header */}
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

            {/* list item */}
            <>
              {adviceResult.map((item: any, index: number) => {
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
                      {index + 1}
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
                            border: `1px solid ${
                              attributeColorPallet[Math.ceil(index % 3)]
                            }`,
                            borderRadius: "8px",
                            m: "4px",
                            textAlign: "center",
                            fontFamily: `${isFarsi ? "Vazirmatn" : customFontFamily}`,
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
                        display: {
                          md: "block",
                          xs: "none",
                        },
                      }}
                    >
                      <Box>{questionnaire.title}</Box>
                      <Box>Q.{question?.index}</Box>
                    </Grid>
                  </Grid>
                );
              })}
            </>
            {/* <Divider /> */}
          </>
        )}
        {/* list item */}
      </Box>
    </div>
  );
};

export default AssessmentAdviceContainer;
