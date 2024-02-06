import Title from "@common/Title";
import { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import SupTitleBreadcrumb from "@common/SupTitleBreadcrumb";
import AdviceSlider from "../common/AdviceSlider";
import Box from "@mui/material/Box";
import { Button, Divider } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import EmptyAdvice from "@assets/img/emptyAdvice.gif";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useParams } from "react-router-dom";
import { useQuery } from "@utils/useQuery";
import { ISubjectReportModel, TId } from "@types";
import { useServiceContext } from "@providers/ServiceProvider";
import toastError from "@utils/toastError";
import { ICustomError } from "@utils/CustomError";
const AssessmentAdviceContainer = (props: any) => {
  const { subjects } = props;
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
        console.log({
          assessmentId: assessmentId,
          attributeLevelTargets: target,
        });
        const data = await createAdviceQueryData.query({
          assessmentId: assessmentId,
          attributeLevelTargets: target,
        });
        setAdviceResult(data?.items);
        handleClose()
      }
    } catch (e) {
      const err = e as ICustomError;
      toastError(err.response.data.message);
    }
  };
  const [subjectData, setsubjectData] = useState<any>([]);
  const [target, setTarget] = useState<any>([]);
  const attributeColorPallet = ["#D81E5B", "#0A2342", "#F9A03F"];
  const attributeBGColorPallet = ["#FDF1F5", "#EDF4FC", "#FEF5EB"];
  
  return (
    <div>
      <Box mt={4}>
        <Title
          borderBottom={true}
          sx={{ borderBottomColor: "#000" }}
          inPageLink="advice"
        >
          <Trans i18nKey="advice" />
        </Title>
      </Box>

      <Dialog
        open={expanded}
        onClose={handleClose}
        maxWidth={"md"}
        fullWidth
        sx={{
          ".MuiDialog-paper": {
            borderRadius: "32px",
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
            background: "#1CC2C4",
            overflowX: "hidden",
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
                background: "#1CC2C4",
                py: 4,
                textAlign: "center",
                color: "#fff",
                fontSize: "32px",
                fontWeight: "700",
                borderRadius: "32px 32px 0 0",
              }}
            >
              Set Your goals
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
                  fontSize: "16px",
                  fontWeight: "500",
                  display: "flex",
                  textAlign: "center",
                  width: "50%",
                  py: 2,
                }}
              >
                Which attributes you want to change? The Advisor will try to
                provide most accurate advice based on your choices
              </Box>
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
                      {/* <Box sx={{ fontSize: "16px", fontWeight: "700" }}>
                        {subject.title}
                      </Box> */}
                      <Divider sx={{ my: 2 }} />
                      <Box>
                        {/* <FormGroup>
                          {subjectData.map((subject: any) => {
                            console.log(subject)
                            subject?.attributes.map((attribute: any) => {
                              return (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      sx={{
                                        color: "#0A2342",
                                        "&.Mui-checked": {
                                          color: "#1CC2C4",
                                        },
                                      }}
                                    />
                                  }
                                  label={attribute.title}
                                />
                              );
                            });
                          })}
                        </FormGroup> */}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
            <Box
              sx={{ borderRadius: "0 0 32px 32px", background: "#fff", py: 8 }}
            >
              {subjectData.map((subject: any) =>
                subject?.attributes.map((attribute: any) => (
                  <AdviceSlider
                    key={attribute.id}
                    defaultValue={attribute?.maturity_level?.value || 0}
                    attribute={attribute}
                    subject={subject?.subject}
                    maturityLevels={attribute?.maturity_scores}
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
                    color: "#1CC2C4",
                    px: 2,
                    py: 1,
                    borderRadius: "16px",
                    fontSize: "16px",
                    fontWeight: "700",
                    width: "fit-content",
                    mr: 2,
                  }}
                  onClick={handleClose}
                >
                  cancel
                </Button>
                <Button
                  sx={{
                    background: "#1CC2C4",
                    color: "#EDFCFC",
                    px: 2,
                    py: 1,
                    borderRadius: "16px",
                    fontSize: "16px",
                    fontWeight: "700",
                    width: "fit-content",
                    "&:hover": {
                      backgroundColor: "rgba(28, 194, 196, 0.5)",
                    },
                  }}
                  onClick={createAdvice}
                >
                  Set these parameters
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <Box mt={6}>
        {!adviceResult ? (
          <Box
            sx={{
              borderRadius: "24px",
              border: "1px solid #9DA7B3 ",
              width: "60%",
              p: 6,
              margin: "0 auto",
            }}
          >
            <Box
              sx={{
                fontSize: "64px",
                fontWeight: "700",
                color: "#1CC2C4",
                textShadow: "0px 0px 11.2px rgba(28, 194, 196, 0.50)",
                textAlign: "center",
              }}
            >
              Advisor
            </Box>
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: "400",
                color: "#0A2342",
                margin: "0 auto",
              }}
            >
              The Advisor service provides you some tips help you to improve
              your software score in diffrent subjects and attributes. It
              considers your priorities you tell itand tries to Give Advices
              with most effectiveness and least efforts to fullfill. some
              advices affect more than attributes and subject. you can always
              change your preferences and goals via setting new parameteres for
              advisor. There are many factors determining the situation whetere
              an advice worths its costs and efforts or not for you. we are
              always here to to see if you have any further question but the
              final decision is yours! Make it wise.
            </Box>
            <Box sx={{ margin: "0 auto", width: "50%" }}>
              <img src={EmptyAdvice} alt="advice" width="100%" />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                sx={{
                  background: "#1CC2C4",
                  color: "#EDFCFC",
                  px: 5,
                  py: 1,
                  borderRadius: "16px",
                  fontSize: "16px",
                  fontWeight: "700",
                  width: "fit-content",
                  "&:hover": {
                    backgroundColor: "rgba(28, 194, 196, 0.5)",
                  },
                }}
                onClick={handleClickOpen}
              >
                Create your first advice
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#0A2342",
                textShadow: "0px 0px 11.2px rgba(10, 35, 66, 0.30)",
                textAlign: "center",
                mb: 6,
              }}
            >
              Advices list
            </Box>

            {/* list header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Box
                sx={{
                  fontSize: "16px",
                  color: "#9DA7B3",
                  fontWeight: "700",
                  textAlign: "center",
                  width: "5%",
                }}
              >
                Number
              </Box>
              <Box
                sx={{
                  width: "40%",
                  fontSize: "16px",
                  color: "#9DA7B3",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                Question
              </Box>
              <Box
                sx={{
                  width: "10%",
                  fontSize: "16px",
                  color: "#9DA7B3",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                What is now
              </Box>
              <Box
                sx={{
                  width: "10%",
                  fontSize: "16px",
                  color: "#9DA7B3",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                What should be
              </Box>
              <Box
                sx={{
                  width: "15%",
                  fontSize: "16px",
                  color: "#9DA7B3",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                Targeted attributes
              </Box>
              <Box
                sx={{
                  width: "10%",
                  fontSize: "16px",
                  color: "#9DA7B3",
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                Questionnaire
              </Box>
            </Box>
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: "64px",
                        color: "#1CC2C4",
                        fontWeight: "700",
                        width: "5%",
                      }}
                    >
                      {index+1}
                    </Box>
                    <Box
                      sx={{
                        width: "40%",
                        color: "#0A2342",
                        fontSize: "16px",
                        fontWeight: "700",
                      }}
                    >
                      {question?.title}
                    </Box>
                    <Box
                      sx={{
                        width: "10%",
                        color: "#0A2342",
                        fontSize: "14px",
                        fontWeight: "300",
                        textAlign: "center",
                      }}
                    >
                      {answeredOption&&answeredOption.index}:{answeredOption&&answeredOption.title}
                    </Box>
                    <Box
                      sx={{
                        width: "10%",
                        color: "#0A2342",
                        fontSize: "14px",
                        fontWeight: "300",
                        textAlign: "center",
                      }}
                    >
                      {recommendedOption.index}:{recommendedOption.title}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        width: "15%",
                        justifyContent: "center",
                      }}
                    >
                      {/* <Box
                        sx={{
                          px: "10px",
                          color: "#0A2342",
                          background: "#EDF4FC",
                          fontSize: "11px",
                          border: "1px solid #0A2342",
                          borderRadius: "8px",
                          m: "4px",
                        }}
                      >
                        Team spirit
                      </Box> */}
                      {/* <Box
                        sx={{
                          px: "10px",
                          color: "#D81E5B",
                          background: "#FDF1F5",
                          fontSize: "11px",
                          border: "1px solid #D81E5B",
                          borderRadius: "8px",
                          m: "4px",
                        }}
                      >
                        reliability
                      </Box> */}
                      {attributes.map((attribute: any, index: number) => {
                        return (
                          <Box
                            key={attribute.id}
                            sx={{
                              px: "10px",
                              color: attributeColorPallet[Math.ceil(index % 3)],
                              background: attributeBGColorPallet[Math.ceil(index % 3)],
                              fontSize: "11px",
                              border: `1px solid  ${
                                attributeColorPallet[Math.ceil(index % 3)]
                              }`,
                              borderRadius: "8px",
                              m: "4px",
                              textAlign:"center"
                            }}
                          >
                            {attribute.title}
                          </Box>
                        );
                      })}
                    </Box>
                    <Box
                      sx={{
                        width: "10%",
                        color: "#1CC2C4",
                        fontSize: "14px",
                        fontWeight: "500",
                        textDecoration: "underline",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign:"center"
                      }}
                    >
                      {questionnaire.title}
                      <Box sx={{ textAlign: "center", textDecoration: "none" }}>
                        Q.{question?.index}
                      </Box>
                    </Box>
                  </Box>
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
