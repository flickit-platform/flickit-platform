import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import {
  ICompareResultBaseInfo,
  ITotalProgress,
  TStatus,
  ISubjectReportModel,
  TId,
} from "@types";
import Title from "@common/Title";
import { calcGridSizeBasedOnTheLengthOfAssessments } from "./utils";
import { getColorOfStatus, styles } from "@styles";
import CircularProgress from "@mui/material/CircularProgress";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import { useServiceContext } from "@providers/ServiceProvider";
import { useQuery } from "@utils/useQuery";
import { useSearchParams } from "react-router-dom";
import QueryData from "@common/QueryData";
import CompareResultSubjectAttributesBarChart from "./CompareResultAttributesBarChart";
import { Divider } from "@mui/material";
const CompareTable = (props: {
  base_infos?: ICompareResultBaseInfo[];
  data?: any;
  isSubject: boolean;
}) => {
  const { data, isSubject } = props;
  const { service } = useServiceContext();
  const [searchParams] = useSearchParams();
  const assessmentIds = searchParams.getAll("assessmentIds");
  return (
    <>
      {!isSubject ? (
        <CompareResultSubjectAttributesBarChart
          data={data}
          isSubject={isSubject}
          assessments={data.assessments}
        />
      ) : (
        <Box>
          {data?.subjects.map((subject: any) => {
            return (
              <CompareResultSubjectAttributesBarChart
                data={subject}
                isSubject={isSubject}
                key={subject.id}
                assessments={data.assessments}
              />
            );
          })}
        </Box>
      )}
    </>
  );
};

const textStyle = {
  fontSize: "1.1rem",
  fontWeight: "bolder",
};

const renderMap: Record<string, (arg: any) => JSX.Element> = {
  Progress: (value: ITotalProgress) => {
    const { progress } = value;
    return (
      <Box sx={{ ...styles.centerV }}>
        <Typography {...textStyle}>
          {progress > 0 && progress < 1 ? (
            <>{progress.toFixed(1)} % </>
          ) : (
            <>{progress.toFixed(0)} % </>
          )}
        </Typography>

        <Box>
          <CircularProgress
            sx={{
              ...styles.circularProgressBackgroundStroke,
              ml: 2,
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
    <Typography {...textStyle} sx={{ color: (t) => t.palette.ml.primary }}>
      {ml} / 5
    </Typography>
  ),
  "Confidence level": (cl: number) => (
    <Typography {...textStyle} sx={{ color: (t) => t.palette.cl.primary }}>
      {cl} / 5
    </Typography>
  ),
  Status: (status: TStatus) => (
    <Typography {...textStyle} sx={{ color: getColorOfStatus(status) }}>
      {status}
    </Typography>
  ),
};

const renderCompareItem = (key: string, value: any) => {
  const component =
    renderMap[key] ||
    ((text) => <Typography {...textStyle}>{text}</Typography>);
  const progressComponent = (obj: any) => (
    <>
      {(obj?.title !== null || obj?.title !== undefined) && (
        <Typography {...textStyle}>{obj?.title}</Typography>
      )}
      {obj?.progress && <Typography {...textStyle}>{obj.progress}%</Typography>}
    </>
  );
  return typeof value !== "object"
    ? component(value)
    : progressComponent(value);
};

const MostSignificanComp = (props: any) => {
  const { data, index, res, setAccumulatedData } = props;

  useEffect(() => {
    setAccumulatedData((prevData: any) => [...prevData, res]);
  }, []);

  return (
    <Box height={"100%"} mb={8}>
      <Title sx={{ my: 1 }}>{data[index]?.assessment?.title}</Title>
      <Box py={1} ml={4} borderBottom={"1px dashed #e7e7e7"} height={"50%"}>
        <Box mb={0.5} mt={1}>
          <Title
            size="small"
            sx={{
              opacity: 0.8,
              fontSize: { xs: "1.4rem", lg: "1.1rem" },
            }}
          >
            <Trans i18nKey={"mostSignificantStrengths"} />
          </Title>
        </Box>
        <Grid container spacing={2} sx={{ py: 1.8 }}>
          <Box
            sx={{
              opacity: 0.96,
              height: "100%",
              mt: 2,
            }}
          >
            <ul
              style={{
                marginBlockStart: 0,
                marginBlockEnd: 0,
                paddingInlineStart: "24px",
              }}
            >
              {res?.top_strengths.map((strength: any, index: number) => (
                <Box sx={{ ...styles.centerV }} mb={1} key={index}>
                  <CircleRoundedIcon
                    fontSize="inherit"
                    sx={{ opacity: 0.5, fontSize: "0.5rem" }}
                  />
                  <Typography
                    textTransform={"uppercase"}
                    fontWeight="bold"
                    sx={{ ml: 1 }}
                  >
                    {strength?.title}
                  </Typography>
                </Box>
              ))}
            </ul>
          </Box>
        </Grid>
      </Box>
      <Box py={1} ml={4} height={"50%"}>
        <Box mb={0.5} mt={1}>
          <Title
            size="small"
            sx={{
              opacity: 0.8,
              fontSize: { xs: "1.4rem", lg: "1.1rem" },
            }}
          >
            <Trans i18nKey={"mostSignificantWeaknesses"} />
          </Title>
        </Box>
        <Grid container spacing={2} sx={{ py: 1.8 }}>
          <Box
            sx={{
              opacity: 0.96,
              height: "100%",
              mt: 2,
            }}
          >
            <ul
              style={{
                marginBlockStart: 0,
                marginBlockEnd: 0,
                paddingInlineStart: "24px",
              }}
            >
              {res?.top_weaknesses.map((weakness: any, index: number) => (
                <Box sx={{ ...styles.centerV }} mb={1} key={index}>
                  <CircleRoundedIcon
                    fontSize="inherit"
                    sx={{ opacity: 0.5, fontSize: "8px" }}
                  />
                  <Typography
                    textTransform={"uppercase"}
                    fontWeight="bold"
                    sx={{ ml: 1 }}
                  >
                    {weakness?.title}
                  </Typography>
                </Box>
              ))}
            </ul>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};
export default CompareTable;
