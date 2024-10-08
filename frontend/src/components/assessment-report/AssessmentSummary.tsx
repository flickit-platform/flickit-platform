import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import { IAssessmentKitReportModel } from "@types";
import Typography from "@mui/material/Typography";
import { styles } from "@styles";
import { Link } from "react-router-dom";
import ColorfullProgress, {
  ProgessBarTypes,
} from "../common/progress/ColorfulProgress";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import Button from "@mui/material/Button";
import { calculateFontSize } from "@/utils/calculateFontSize";
import { secondaryFontFamily } from "@/config/theme";
import { t } from "i18next";

interface IAssessmentSummaryProps {
  assessmentKit: IAssessmentKitReportModel;
  data: any;
  progress: number;
  questionCount: number;
  answerCount: number;
}

export const AssessmentSummary = (props: IAssessmentSummaryProps) => {
  const { assessmentKit, data, progress, questionCount, answerCount } = props;
  const {
    assessment: { lastModificationTime, creationTime },
  } = data;
  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      textAlign="center"
      gap={3}
      py={4}
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "12px",
        px: { xs: 2, sm: 3 },
        position: "relative",
      }}
      color="#004F83"
    >
      <Box sx={{ ...styles.centerCVH }} gap={1}>
        <Typography
          fontSize={calculateFontSize(assessmentKit?.title.length)}
          sx={{
            textDecoration: "none",
          }}
          color="primary"
          fontWeight={800}
          fontFamily={secondaryFontFamily}
        >
          {assessmentKit?.title}
        </Typography>
      </Box>
      <Box
        sx={{
          ...styles.centerCVH,
          textDecoration: "none",
          color: "inherit !important",
        }}
        width={{ xl: "80%", lg: "90%", md: "90%", xs: "90%", sm: "90%" }}
        component={Link}
        to="./../questionnaires"
      >
        <ColorfullProgress
          denominator={questionCount}
          numaratur={answerCount}
          type={ProgessBarTypes.Questioannaire}
          progressHeight="24px"
        />
      </Box>

      <Button
        variant="contained"
        sx={{
          borderRadius: "4px",
          backgroundColor: "primary",
          borderColor: "primary",
          paddingx: "6px",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#004F83",
            borderColor: "#004F83",
          },
          width: { xl: "50%", lg: "56%", md: "90%", xs: "90%", sm: "90%" },
        }}
        size="large"
        component={Link}
        to="./../questionnaires"
      >
        <Trans i18nKey="seeQuestionaires" />
      </Button>
      <Box
        sx={{ ...styles.centerV }}
        width="100%"
        justifyContent="space-evenly"
      >
        <Box
          display="flex"
          flexDirection="column"
          textAlign={"center"}
          gap=".5rem"
        >
          <Typography color="#243342" variant="bodyMedium">
            <Trans i18nKey="created" values={{ progress }} />
            {": "}
          </Typography>
          <Typography color="#243342" variant="titleMedium">
            {t(convertToRelativeTime(creationTime))}
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          textAlign={"center"}
          gap=".5rem"
        >
          <Typography color="#243342" variant="bodyMedium">
            <Trans i18nKey="updated" />:
          </Typography>
          <Typography color="#243342" variant="titleMedium">
            {t(convertToRelativeTime(lastModificationTime))}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
