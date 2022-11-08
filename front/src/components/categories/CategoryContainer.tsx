import React, { useEffect, useRef, useState } from "react";
import { Button, Divider, Skeleton, Typography } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import QANumberIndicator from "../../components/shared/QANumberIndicator";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import { CategoryList } from "./CategoryList";
import { Trans } from "react-i18next";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import { styles } from "../../config/styles";

const CategoryContainer = (props: any) => {
  const {
    overallProgress,
    isCompleted,
    isExpanded,
    setIsExpanded,
    subjectQueryData,
    total_metric_number,
    total_answered_metric,
    loading,
  } = useCategory(props);

  return (
    <Box
      flexWrap={"wrap"}
      sx={{
        ...styles.centerCV,
        backgroundColor: "#2e7d72",
        background: `linear-gradient(135deg, #2e7d72 ${overallProgress}%, #01221e ${overallProgress}%)`,
        px: { xs: 3, md: 4 },
      }}
      py={4}
      borderRadius={2}
      my={2}
      color="white"
      position={"relative"}
    >
      <Box display={"flex"} justifyContent="space-between">
        <Box pb={1} pt={1} pr={4}>
          <Typography variant="h4" fontFamily="RobotoMedium">
            {loading || isCompleted === undefined ? (
              <Skeleton width="220px" />
            ) : isCompleted ? (
              <Trans i18nKey={"YouHaveFinishedAllCategories"} />
            ) : (
              <Trans i18nKey="toAssessSystemNeedToAnswerQuestions" />
            )}
          </Typography>
          <Typography
            variant="h6"
            fontFamily="RobotoMedium"
            letterSpacing={".05rem"}
          >
            {loading || isCompleted === undefined ? (
              <Skeleton width="164px" />
            ) : isCompleted ? (
              <Trans i18nKey={"ToChangeYourInsightTryEditingCategories"} />
            ) : (
              <Trans i18nKey="pickupCategory" />
            )}
          </Typography>
        </Box>
        <Box
          minWidth="130px"
          display="flex"
          justifyContent={"flex-end"}
          sx={{
            position: {
              xs: "absolute",
              md: "static",
              top: "6px",
              right: "12px",
            },
          }}
        >
          {loading ? (
            <Skeleton width="60px" height="40px" />
          ) : (
            <QANumberIndicator
              color="white"
              q={total_metric_number}
              a={total_answered_metric}
              variant="h6"
            />
          )}
        </Box>
      </Box>
      <Collapse in={isExpanded}>
        <Box>
          <Divider sx={{ borderColor: "white", opacity: 0.4, mt: 2, mb: 2 }} />
          <Box pb={2}>
            <Box sx={{ ...styles.centerV }}>
              <CategoryRoundedIcon sx={{ mr: 1 }} />
              <Typography
                variant="h5"
                color="white"
                fontFamily="RobotoMedium"
                letterSpacing={".05rem"}
              >
                <Trans i18nKey="categories" />
              </Typography>
            </Box>
            <CategoryList subjectQueryData={subjectQueryData} />
          </Box>
        </Box>
      </Collapse>
      <Button
        variant="contained"
        sx={{
          position: "relative",
          top: "30px",
          alignSelf: "center",
          borderRadius: 3,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          pl: 2,
          pr: 2,
        }}
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
        size="small"
        startIcon={
          isExpanded ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />
        }
      >
        {isExpanded ? (
          <Trans i18nKey={"closeCategories"} />
        ) : (
          <Trans i18nKey={"seeCategories"} />
        )}
      </Button>
    </Box>
  );
};

const useCategory = (props: any) => {
  const { subjectQueryData = {} } = props;
  const { data = {}, loading = true, loaded } = subjectQueryData;
  const { total_metric_number, total_answered_metric } = data;
  const [isExpanded, setIsExpanded] = useState(false);
  const isCompleted = loaded
    ? total_answered_metric === 0
      ? false
      : total_metric_number === total_answered_metric
    : undefined;

  useEffect(() => {
    const isCompleted =
      total_answered_metric === 0
        ? false
        : total_metric_number === total_answered_metric;

    if (loaded) {
      setIsExpanded(isCompleted ? false : true);
    }
  }, [loading]);

  const overallProgress =
    total_metric_number === 0
      ? 0
      : (total_answered_metric / total_metric_number) * 100;

  return {
    overallProgress,
    isCompleted,
    isExpanded,
    setIsExpanded,
    subjectQueryData,
    total_metric_number,
    total_answered_metric,
    loading,
  };
};

export { CategoryContainer };
