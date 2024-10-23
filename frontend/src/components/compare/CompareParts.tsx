import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ComparePartItem from "./ComparePartItem";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import { createSearchParams, useNavigate } from "react-router-dom";
import {
  compareActions,
  useCompareContext,
  useCompareDispatch,
} from "@providers/CompareProvider";
import { styles } from "@styles";
import AlertBox from "@common/AlertBox";
import forLoopComponent from "@utils/forLoopComponent";
import Skeleton from "@mui/material/Skeleton";
import {theme} from "@config/theme";

const CompareParts = () => {
  const { assessmentIds, assessment_kit, loading } = useCompareContext();
  return (
    <Box sx={{ pb: { xs: 6, sm: 0 } }}>
      <Box my={3}>
        <CompareSelectedAssessmentKitInfo />
      </Box>
      <Box position={"relative"}>
        {loading ? (
          <Skeleton height="90vh" sx={{ marginTop: "-20vh" }} />
        ) : (
          <>
            <CompareButton
              disabled={
                (assessmentIds && assessmentIds?.length <= 1) ||
                (assessment_kit && assessment_kit?.length <= 1)
              }
            />
            <Grid container spacing={3}>
              {forLoopComponent(4, (index) => {
                return (
                  <Grid item xs={12} md={6} key={index}>
                    <ComparePartItem
                      data={assessment_kit && assessment_kit[index]}
                      index={index}
                      disabled={
                        (assessmentIds && assessmentIds?.length >= index) ||
                        (assessment_kit && assessment_kit.length >= index)
                          ? false
                          : true
                      }
                    />
                  </Grid>
                );
              })}
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

const CompareButton = (props: { disabled?: boolean }) => {
  const { disabled = false } = props;
  const navigate = useNavigate();
  const { assessment_kit, assessmentIds } = useCompareContext();
  const handleClick = () => {
    const id = assessment_kit.map((item: any) => item.id);
    if (assessment_kit || assessmentIds) {
      navigate({
        pathname: "result",
        search: createSearchParams({ assessment_id: id }).toString(),
      });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        size="large"
        disabled={disabled}
        sx={{ ...styles.compareButton }}
        style={{...theme.typography.labelLarge}}
        onClick={handleClick}
      >
        <Trans i18nKey="compare" />
      </Button>
      <Box sx={{ ...styles.compareButtonBg }} />
    </>
  );
};

const CompareSelectedAssessmentKitInfo = () => {
  const { assessment_kit, assessmentIds } = useCompareContext();
  const dispatch = useCompareDispatch();

  const makeNewComparison = () => {
    dispatch(compareActions.setAssessmentIds([]));
    dispatch(compareActions.setAssessmentKit([]));
  };
  return assessment_kit || assessmentIds ? (
    <AlertBox
      severity="info"
      action={
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={makeNewComparison}
        >
          <Trans i18nKey="newComparison" />
        </Button>
      }
    >
      <Trans i18nKey="toCompareAssessmentsOfOtherAssessmentKits" />
    </AlertBox>
  ) : (
    <></>
  );
};

export default CompareParts;
