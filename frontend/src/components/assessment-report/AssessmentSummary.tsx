import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import {
  AssessmentKitInfoType,
  ExpertGroupDetails,
  AssessmentKitStatsExpertGroup,
  IAssessmentKitReportModel,
  PathInfo,
} from "@types";
import Typography from "@mui/material/Typography";
import { styles } from "@styles";
import { Link, useNavigate, useParams } from "react-router-dom";
import formatDate from "@/utils/formatDate";
import ColorfullProgress, {
  ProgessBarTypes,
} from "../common/progress/ColorfulProgress";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import { Button } from "@mui/material";
import MoreActions from "@common/MoreActions";
import useMenu from "@utils/useMenu";
import SettingsIcon from "@mui/icons-material/Settings";
import { calculateFontSize } from "@/utils/calculateFontSize";
interface IAssessmentSummaryProps {
  assessmentKit: IAssessmentKitReportModel;
  expertGroup: AssessmentKitStatsExpertGroup;
  data: any;
  progress: number;
  questionCount: number;
  answerCount: number;
}

export const AssessmentSummary = (props: IAssessmentSummaryProps) => {
  const {
    assessmentKit,
    expertGroup,
    data,
    progress,
    questionCount,
    answerCount,
  } = props;
  const {
    assessment: { title, lastModificationTime, creationTime, id: assessmentId },
    assessmentPermissions: { manageable },
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
        borderRadius: "32px",
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
          color="#00365C"
          fontWeight={800}
        >
          {assessmentKit?.title}
        </Typography>
      </Box>
      <Box
        sx={{ ...styles.centerCVH, textDecoration: "none", color: "inherit !important" }}
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
          borderRadius: "24px",
          textTransform: "none",
          backgroundColor: "#00365C",
          borderColor: "#00365C",
          color: "#E1E3E5",
          padding: "12px",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#004F83",
            borderColor: "#004F83",
          },
          width: { xl: "50%", lg: "56%", md: "90%", xs: "90%", sm: "90%" },
        }}
        size="small"
        component={Link}
        to="./../questionnaires"
      >
        <Typography variant="titleLarge">
          <Trans i18nKey="seeQuestionaires" />
        </Typography>
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
            {convertToRelativeTime(creationTime)}
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
            {convertToRelativeTime(lastModificationTime)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const Actions = (props: { assessmentId: string; manageable: boolean }) => {
  const { assessmentId, manageable } = props;
  const navigate = useNavigate();
  const { spaceId } = useParams();

  const assessmentSetting = (e: any) => {
    navigate({
      pathname: `/${spaceId}/assessments/1/assessmentsettings/${assessmentId}`,
    });
  };
  return (
    <MoreActions
      {...useMenu()}
      boxProps={{ position: "absolute", top: "10px", right: "10px", zIndex: 2 }}
      items={[
        manageable && {
          icon: <SettingsIcon fontSize="small" />,
          text: <Trans i18nKey="settings" />,
          onClick: assessmentSetting,
        },
      ]}
    />
  );
};
