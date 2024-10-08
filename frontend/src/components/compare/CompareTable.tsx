import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ITotalProgress, TStatus } from "@types";
import { getColorOfStatus, styles } from "@styles";
import CircularProgress from "@mui/material/CircularProgress";
import CompareResultSubjectAttributesBarChart from "./CompareResultAttributesBarChart";

const CompareTable = (props: { data?: any; isSubject: boolean }) => {
  const { data, isSubject } = props;
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

export default CompareTable;
