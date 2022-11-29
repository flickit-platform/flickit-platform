import React from "react";
import { Alert, Chip, CircularProgress, Link, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Trans } from "react-i18next";
import { getColorOfStatus, styles } from "../../config/styles";
import { Gauge } from "../shared/charts/Gauge";
import ProgressChip from "../shared/ProgressChip";
import Title from "../shared/Title";
import {
  Bar,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { t } from "i18next";
import {
  ICompareResultBaseInfo,
  ICompareResultCompareItems,
  ICompareResultModel,
  ICompareResultSubject,
  ITotalProgress,
  ITotalProgressModel,
  TStatus,
} from "../../types";
import AlertBox from "../shared/AlertBox";

interface ICompareResultProps {
  data: ICompareResultModel;
}

const CompareResult = (props: ICompareResultProps) => {
  const { data } = props;

  return (
    <Box mt={4}>
      <CompareItems data={data} />
    </Box>
  );
};

const CompareItems = (props: { data: ICompareResultModel }) => {
  const { data } = props;
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box
        px={1}
        minWidth={
          data.base_infos.length === 4
            ? "760px"
            : data.base_infos.length === 3
            ? "550px"
            : "320px"
        }
      >
        <GeneralInfo data={data} />
        <CompareResultAssessments data={data.base_infos} />
        <CompareResultOverAllInsights
          data={data.overall_insights}
          base_infos={data.base_infos}
        />
        <CompareResultSubjects
          data={data.subjects}
          base_infos={data.base_infos}
        />
      </Box>
    </Box>
  );
};

const GeneralInfo = (props: { data: ICompareResultModel }) => {
  const { data } = props;
  const { base_infos, subjects } = data;
  const profile = base_infos[0].profile;
  return (
    <AlertBox severity="info" sx={{ mb: 3 }}>
      <Trans i18nKey={"allOfTheSelectedAssessmentsUse"} />
      <Chip sx={{ mx: 0.6 }} label={profile} />{" "}
      <Trans i18nKey={"whichHasNamed"} values={{ value: subjects.length }} />
      {subjects.map((subject) => (
        <Link href={`#${subject.title}`} sx={{ mx: 0.6 }}>
          {subject.title}
        </Link>
      ))}
    </AlertBox>
  );
};

const CompareResultAssessments = (props: {
  data: ICompareResultBaseInfo[];
}) => {
  const { data } = props;

  return (
    <Box>
      <Grid container spacing={2}>
        {data.map((item) => {
          return (
            <Grid
              item
              xs={12 / (data?.length || 1)}
              sx={{
                "&:not(:last-of-type) > div": {
                  borderRight: "1px solid #e7e7e7",
                },
              }}
            >
              <Box
                sx={{
                  p: { xs: 0.5, sm: 1, md: 2 },
                  ...styles.centerCH,
                }}
              >
                <Title>{item.title}</Title>
                <Box
                  sx={{
                    ...styles.centerV,
                    mt: 2,
                    justifyContent: { xs: "center", lg: "flex-end" },
                  }}
                >
                  <Gauge systemStatus={item.status} maxWidth="250px" m="auto" />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{ flexDirection: { xs: "column-reverse", lg: "row" } }}
                ></Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <Box mt={2}>
        <Title size="small">
          <Trans />
        </Title>
        <Grid container spacing={2}></Grid>
      </Box>
    </Box>
  );
};

const CompareResultOverAllInsights = (props: {
  data: ICompareResultCompareItems[];
  base_infos: ICompareResultBaseInfo[];
}) => {
  const { data, base_infos } = props;

  return (
    <>
      <div id="generalSpecification" />
      <Box pt={8}>
        <CompareTable
          title="generalSpecification"
          data={data}
          base_infos={base_infos}
        />
      </Box>
    </>
  );
};

const CompareResultSubjects = (props: {
  data: ICompareResultSubject[];
  base_infos: ICompareResultBaseInfo[];
}) => {
  const { data, base_infos } = props;

  return (
    <Box>
      {data.map((item) => {
        return (
          <>
            <div id={item.title} />
            <Box pt={10}>
              <CompareResultSubjectAssessment
                data={item}
                base_infos={base_infos}
              />
              <CompareResultSubjectAttributes
                data={item.attributes_info}
                base_infos={base_infos}
              />
            </Box>
          </>
        );
      })}
    </Box>
  );
};

const CompareResultSubjectAssessment = (props: {
  data: ICompareResultSubject;
  base_infos: ICompareResultBaseInfo[];
}) => {
  const { data, base_infos } = props;

  return (
    <CompareTable
      title={data.title}
      data={data.subject_report_info}
      base_infos={base_infos}
    />
  );
};

const CompareResultSubjectAttributes = (props: {
  data: any[];
  base_infos: ICompareResultBaseInfo[];
}) => {
  const { data, base_infos } = props;

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "1.05rem",
          fontFamily: "RobotoRegular",
          opacity: 0.7,
          mb: 0.5,
          mt: 2,
        }}
      >
        <Trans i18nKey="attributes" />
      </Typography>
      <Box sx={{ overflowX: "auto", overflowY: "hidden" }}>
        <Box height="420px" minWidth="740px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis type="number" domain={[0, 5]} tickCount={6} />
              <Tooltip />
              <Legend />
              {base_infos.map((assessment, index) => {
                const title = assessment.title;
                return title ? (
                  <Bar
                    dataKey={assessment.id}
                    name={title}
                    fill={barColors[index]}
                    maxBarSize={20}
                  />
                ) : null;
              })}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
};

const CompareTable = (props: {
  data: { title: string; items: (string | string[])[] }[];
  title: string;
  base_infos: ICompareResultBaseInfo[];
}) => {
  const { data, title, base_infos } = props;
  return (
    <>
      <Box mt={2}>
        <Title
          size="small"
          sx={{ opacity: 0.9, flex: 1 }}
          inPageLink={`${title}`}
        >
          <Trans i18nKey={title} />
        </Title>

        {data.map((part) => {
          return (
            <Box borderBottom={"1px dashed #e7e7e7"} py={1}>
              <Box mb={0.5} mt={1}>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontFamily: "RobotoRegular",
                    opacity: 0.7,
                  }}
                >
                  {part.title}
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ py: 1.8 }}>
                {part.items.map((value) => {
                  return (
                    <Grid
                      item
                      xs={12 / (base_infos?.length || 1)}
                      sx={{
                        "&:not(:last-of-type) > div": {
                          borderRight: "1px solid #e7e7e7",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          opacity: 0.96,
                          height: "100%",
                        }}
                      >
                        {Array.isArray(value) ? (
                          <ul
                            style={{
                              marginBlockStart: 0,
                              marginBlockEnd: 0,
                              paddingInlineStart: "24px",
                            }}
                          >
                            {value.map((text) => (
                              <li>
                                <Typography
                                  sx={{ my: 0.3 }}
                                  fontFamily={"RobotoMedium"}
                                  fontSize="1.1rem"
                                >
                                  {text}
                                </Typography>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          renderCompareItem(part.title, value)
                        )}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

const renderMap: Record<string, (arg: any) => JSX.Element> = {
  Progress: (value: ITotalProgress) => {
    const { progress } = value;
    return (
      <Box display="flex" alignItems={"center"}>
        <Typography
          fontFamily={"RobotoBold"}
          fontSize="1.1rem"
          fontWeight="bolder"
        >
          {progress > 0 && progress < 1 ? (
            <>{progress.toFixed(1)} % </>
          ) : (
            <>{progress.toFixed(0)} % </>
          )}
        </Typography>

        <Box>
          <CircularProgress
            sx={{
              ml: 2,
              [`& .MuiCircularProgress-circle`]: {
                strokeLinecap: "round",
              },
              boxShadow: "0 0 4px #bbb7b7 inset",
              borderRadius: "100%",
              ...styles.centerVH,
            }}
            size="36px"
            value={progress}
            variant="determinate"
          />
        </Box>
      </Box>
    );
  },
  "Maturity level": (ml: number) => (
    <Typography
      fontFamily={"RobotoBold"}
      fontSize="1.1rem"
      fontWeight="bolder"
      sx={{ color: (t) => t.palette.ml.primary }}
    >
      {ml} / 5
    </Typography>
  ),
  "Confidence level": (cl: number) => (
    <Typography
      fontFamily={"RobotoBold"}
      fontWeight="bolder"
      fontSize="1.1rem"
      sx={{ color: (t) => t.palette.cl.primary }}
    >
      {cl} / 5
    </Typography>
  ),
  Status: (status: TStatus) => (
    <Typography
      fontFamily={"RobotoBold"}
      fontSize="1.1rem"
      fontWeight="bolder"
      sx={{ color: getColorOfStatus(status) }}
    >
      {status}
    </Typography>
  ),
};

const barColors = ["#2b3d85", "#472b85", "#852b74", "#852b3a"];

const renderCompareItem = (key: string, value: any) => {
  const component =
    renderMap[key] ||
    ((text) => (
      <Typography
        fontFamily={"RobotoBold"}
        fontWeight="bolder"
        fontSize="1.1rem"
      >
        {text}
      </Typography>
    ));

  return component(value);
};

export default CompareResult;
