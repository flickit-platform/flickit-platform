import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import {
  AssessmentKitInfoType,
  ExpertGroupDetails,
  IAssessmentKitReportModel,
  ISubjectInfo,
  PathInfo,
} from "@types";
import Typography from "@mui/material/Typography";
import { getMaturityLevelColors, styles } from "@styles";
import { Link } from "react-router-dom";
import formatDate from "@/utils/formatDate";
import ColorfullProgress from "../common/progress/ColorfulProgress";
import { convertToRelativeTime } from "@/utils/convertToRelativeTime";
import { Avatar, Button, Chip, Divider, Grid, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
interface IAssessmentReportKit {
  assessmentKit: IAssessmentKitReportModel;
}

export const AssessmentReportKit = (props: IAssessmentReportKit) => {
  const { assessmentKit } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const element: any = contentRef.current;
    if (element) {
      const computedStyle = window.getComputedStyle(element);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const elementHeight = element.offsetHeight;
      console.log(lineHeight);
      console.log(elementHeight);
      setIsOverflowing(elementHeight > lineHeight);
    }
  }, [assessmentKit.summary]);
  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      justifyContent="left"
      textAlign="left"
      maxHeight="100%"
      gap={3}
      py={2}
      sx={{
        background: "#fff",
        boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.25)",
        borderRadius: "32px",
        px: { xs: 2, sm: 3.75 },
      }}
    >
      <Box sx={{ ...styles.centerCVH }} width="100%" gap={1}>
        <Box
          display="flex"
          flexDirection={{
            xl:
              assessmentKit.title.length +
                assessmentKit.expertGroup.title.length >
              80
                ? "column"
                : "row",
            lg:
              assessmentKit.title.length +
                assessmentKit.expertGroup.title.length >
              60
                ? "column"
                : "row",
            md:
              assessmentKit.title.length +
                assessmentKit.expertGroup.title.length >
              40
                ? "column"
                : "row",
            xs: "column",
            sm: "column",
          }}
          gap={1}
          justifyContent="space-between"
          width="100%"
        >
          <Box
            display="flex"
            alignItems="center"
            gap="4px"
            justifyContent="flex-start"
          >
            <Typography color="#243342" variant="titleMedium">
              <Trans i18nKey="thisAssessmentIsUsing" />
            </Typography>
            <Typography
              component={Link}
              to={`/assessment-kits/${assessmentKit?.id}`}
              color="#8B0035"
              variant="titleLarge"
              sx={{
                textDecoration: "none",
              }}
            >
              {assessmentKit.title}
            </Typography>
            <Typography color="#243342" variant="titleMedium">
              <Trans i18nKey="kit" />.
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap="8px"
            justifyContent="flex-end"
          >
            <Typography
              color="#73808C"
              variant="titleMedium"
              fontStyle="italic"
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              <Trans i18nKey="providedBy" />
            </Typography>
            <Avatar
              component={Link}
              to={`/user/expert-groups/${assessmentKit?.expertGroup.id}`}
              src={assessmentKit.expertGroup.picture}
              sx={{ cursor: "pointer" }}
            />
            <Typography
              component={Link}
              to={`/user/expert-groups/${assessmentKit?.expertGroup.id}`}
              color="#8B0035"
              variant="titleLarge"
              sx={{
                textDecoration: "none",
              }}
            >
              {assessmentKit.expertGroup.title}
            </Typography>
          </Box>
        </Box>

        {isOverflowing ? (
          <Box display="flex" flexDirection="column" width="100%" mb={1}>
            <Typography
              color="#243342"
              variant="titleSmall"
              width="100%"
              textAlign="left"
              sx={{
                wordBreak: "break-all",
                overflow: isExpanded ? "visible" : "hidden",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: isExpanded ? "none" : 1,
              }}
              ref={contentRef}
            >
              {assessmentKit.summary}
            </Typography>
            <Typography
              variant="titleSmall"
              color="#246297"
              sx={{ cursor: "pointer" }}
              onClick={toggleExpanded}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </Typography>
          </Box>
        ) : (
          <Box display="flex" width="100%" mb={1}>
            <Typography
              color="#243342"
              variant="titleSmall"
              width="100%"
              textAlign="left"
              sx={{
                wordBreak: "break-all",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
              }}
              ref={contentRef}
            >
              {assessmentKit.summary}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
