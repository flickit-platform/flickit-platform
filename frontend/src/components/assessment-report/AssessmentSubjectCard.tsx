import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BgLines1 from "@assets/svg/bgLines1.svg";
import SubjectProgress from "@common/progress/SubjectProgress";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { getMaturityLevelColors, styles } from "@styles";
import { ISubjectInfo, IMaturityLevel } from "@types";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import StartRoundedIcon from "@mui/icons-material/StartRounded";

interface IAssessmentSubjectCardProps extends ISubjectInfo {
  colorCode: string;
  maturity_level?: IMaturityLevel;
}

export const AssessmentSubjectCard = (props: IAssessmentSubjectCardProps) => {
  const {
    title,
    maturity_level,
    progress = 0,
    id,
    image,
    colorCode,
    description = "",
  } = props;
  return (
    <Paper
      sx={{
        borderRadius: 3,
        backgroundColor: colorCode,
        backgroundImage: `url(${BgLines1})`,
        backgroundPosition: "30% 30%",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        transition: "background-position .4s ease",
        "&:hover": {
          backgroundPosition: "0% 0%",
        },
        height: "100%",
        position: "relative",
      }}
      elevation={2}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        sx={{
          textAlign: "center",
          color: (t) => t.palette.getContrastText(colorCode),
          px: { xs: 2, sm: 5 },
          py: { xs: 3, sm: 5 },
          height: "100%",
        }}
      >
        <Typography
          variant="h4"
          textTransform={"uppercase"}
          letterSpacing={".13em"}
          fontFamily="Oswald"
          fontWeight={500}
        >
          {title}
        </Typography>
        <ReadMoreAboutSubject
          colorCode={colorCode}
          title={title}
          description={description}
        />

        <SubjectProgress progress={progress} colorCode={colorCode} />

        <SubjectStatus title={title} maturity_level={maturity_level} />
        <Box mt="auto">
          <Button
            variant="contained"
            size="large"
            fullWidth
            component={Link}
            to={progress === 100 ? `./${id}#insight` : `./${id}`}
            state={{ status }}
            startIcon={
              progress === 0 ? <StartRoundedIcon /> : <QueryStatsRoundedIcon />
            }
          >
            <Trans i18nKey={"viewInsights"} />
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

const SubjectStatus = (
  props: Pick<IAssessmentSubjectCardProps, "title" | "maturity_level">
) => {
  const { title, maturity_level } = props;
  const colorPallet = getMaturityLevelColors(maturity_level?.index || 0);
  const hasStats = maturity_level?.index ? true : false;
  return (
    <Box mt={8} mb={16} sx={{ ...styles.centerCH }} minHeight={"80px"}>
      {
        <>
          <Typography textAlign={"center"}>
            <Trans i18nKey="subjectStatusIs" values={{ title }} />{" "}
            {hasStats && <Trans i18nKey="evaluatedAs" />}
          </Typography>
          <Typography
            variant={hasStats ? "h3" : "h4"}
            letterSpacing=".17em"
            sx={{
              fontWeight: "500",
              borderBottom: colorPallet
                ? `3px solid ${colorPallet}`
                : undefined,
              pl: 1,
              pr: 1,
            }}
          >
            {maturity_level?.title ? (
              maturity_level?.title
            ) : (
              <Trans i18nKey="notEvaluated" />
            )}
          </Typography>
        </>
      }
    </Box>
  );
};

const ReadMoreAboutSubject = (
  props: Pick<
    IAssessmentSubjectCardProps,
    "title" | "colorCode" | "description"
  >
) => {
  const { title, colorCode, description } = props;
  return (
    <Box
      sx={{
        "&:hover .subj_desc": description && {
          opacity: 1,
          zIndex: 2,
          transition: "opacity .2s .2s ease, z-index .2s .2s ease",
        },
      }}
    >
      <Typography
        variant="subSmall"
        sx={{
          opacity: 0.7,
          letterSpacing: ".14em",
          color: (t) => {
            return t.palette.getContrastText(colorCode);
          },
          textDecoration: "underline",
          cursor: "pointer",
        }}
        fontFamily="Roboto"
      >
        <Trans i18nKey="readAbout" /> {title}
      </Typography>
      <Box
        className="subj_desc"
        sx={{
          transition: "opacity .2s .4s ease, z-index .2s .4s ease",
          backgroundColor: "#000000e3",
          opacity: 0,
          zIndex: -1,
          px: 2,
          py: 4,
          borderRadius: 2,
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 25px)",
          textAlign: "center",
        }}
      >
        <Typography>{description}</Typography>
      </Box>
    </Box>
  );
};
