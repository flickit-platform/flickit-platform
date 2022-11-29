import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ComparePartItem from "./ComparePartItem";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import QueryData from "../shared/QueryData";
import { LoadingSkeleton } from "../shared/loadings/LoadingSkeleton";
import {
  compareActions,
  useCompareContext,
  useCompareDispatch,
} from "../../providers/CompareProvider";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Chip from "@mui/material/Chip";
import { styles } from "../../config/styles";
import AlertBox from "../shared/AlertBox";
import PermissionControl from "../shared/PermissionControl";

const CompareParts = () => {
  const { assessmentIds, assessmentsInfoQueryData } = useCompareParts();

  return (
    <Box sx={{ pb: { xs: 6, sm: 0 } }}>
      <PermissionControl error={assessmentsInfoQueryData.errorObject}>
        <Box my={3}>
          <ProfileField />
        </Box>
        <Box position={"relative"}>
          <QueryData
            {...assessmentsInfoQueryData}
            isDataEmpty={() => false}
            renderLoading={() => {
              return (
                <>
                  <CompareButton disabled={true} />
                  <Grid container spacing={3}>
                    {[0, 1, 2, 3].map((index) => {
                      return (
                        <Grid item xs={12} md={6} key={index}>
                          <LoadingSkeleton
                            height={
                              assessmentIds?.length === 0 ? "264px" : "290px"
                            }
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </>
              );
            }}
            render={(res = []) => {
              return (
                <>
                  <CompareButton
                    assessmentIds={assessmentIds as string[]}
                    disabled={assessmentIds?.length <= 1}
                  />
                  <Grid container spacing={3}>
                    {[0, 1, 2, 3].map((index) => {
                      const data = res[index];
                      return (
                        <Grid item xs={12} md={6} key={index}>
                          <ComparePartItem
                            data={data}
                            index={index}
                            disabled={
                              assessmentIds.length >= index ? false : true
                            }
                            fetchAssessmentsInfo={
                              assessmentsInfoQueryData.query
                            }
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </>
              );
            }}
          />
        </Box>
      </PermissionControl>
    </Box>
  );
};

const useCompareParts = () => {
  const { service } = useServiceContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const assessmentsInfoQueryData = useQuery({
    service: (args, config) => service.fetchAssessmentsInfo(args, config),
    runOnMount: false,
    initialLoading: true,
    initialData: [],
  });
  const { assessmentIds, profile: contextProfile } = useCompareContext();
  const dispatch = useCompareDispatch();

  useEffect(() => {
    assessmentsInfoQueryData.query({ assessmentIds });
    setSearchParams(createSearchParams({ assessmentIds } as any), {
      replace: true,
    });
  }, [assessmentIds.join()]);

  useEffect(() => {
    if (assessmentsInfoQueryData.loaded && !contextProfile) {
      const profile = assessmentsInfoQueryData.data?.find(
        (item: any) => item?.assessment_profile
      );
      if (profile) {
        dispatch(compareActions.setProfile(profile.assessment_profile));
      }
    }
  }, [assessmentsInfoQueryData.loaded]);

  useEffect(() => {
    const assessmentIdsParams = searchParams.getAll("assessmentIds");
    if (assessmentIdsParams.length == 0 && assessmentIds.length > 0) {
      assessmentsInfoQueryData.query({ assessmentIds: [] });
      dispatch(compareActions.setProfile(null));
      dispatch(compareActions.setAssessmentIds(assessmentIdsParams));
    }
  }, [searchParams]);

  return { assessmentIds, assessmentsInfoQueryData };
};

const CompareButton = (props: {
  disabled?: boolean;
  assessmentIds?: string[];
}) => {
  const { assessmentIds, disabled = false } = props;
  const navigate = useNavigate();

  const handleClick = () => {
    if (assessmentIds) {
      navigate({
        pathname: "result",
        search: createSearchParams({
          assessmentIds,
        }).toString(),
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
        onClick={handleClick}
      >
        <Trans i18nKey="compare" />
      </Button>
      <Box sx={{ ...styles.compareButtonBg }} />
    </>
  );
};

const ProfileField = () => {
  const { profile } = useCompareContext();
  const dispatch = useCompareDispatch();
  const makeNewComparison = () => {
    dispatch(compareActions.setAssessmentIds([]));
    dispatch(compareActions.setProfile(null));
  };
  return profile ? (
    <AlertBox
      severity="info"
      action={
        <Button
          variant="contained"
          size="small"
          color="info"
          onClick={makeNewComparison}
        >
          <Trans i18nKey="newComparison" />
        </Button>
      }
    >
      <AlertTitle>
        <Trans i18nKey="assessmentsAreFilteredBy" />{" "}
        <Chip label={profile.title} />
      </AlertTitle>
      <Trans i18nKey="inOrderToSelectAssessmentsFromOtherProfiles" />
    </AlertBox>
  ) : (
    <></>
  );
};

export default CompareParts;
