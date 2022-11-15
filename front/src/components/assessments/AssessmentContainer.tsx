import React, { useEffect, useRef, useState } from "react";
import { Trans } from "react-i18next";
import Title from "../../components/shared/Title";
import QueryData from "../../components/shared/QueryData";
import EmptyError from "../../components/shared/errors/EmptyError";
import { useServiceContext } from "../../providers/ServiceProvider";
import useDialog from "../../utils/useDialog";
import { AssessmentsList } from "./AssessmentList";
import CreateAssessmentDialog from "./AssessmentCEFromDialog";
import AddchartRoundedIcon from "@mui/icons-material/AddchartRounded";
import { Box, Typography } from "@mui/material";
import { ICustomError } from "../../utils/CustomError";
import { useParams } from "react-router-dom";
import { LoadingSkeletonOfAssessments } from "../../components/shared/loadings/LoadingSkeletonOfAssessments";
import toastError from "../../utils/toastError";
import { ToolbarCreateItemBtn } from "../../components/shared/buttons/ToolbarCreateItemBtn";
import { ECustomErrorType } from "../../types";
import { NotFoundOrAccessDenied } from "../../components/shared/errors/NotFoundOrAccessDenied";

const AssessmentContainer = () => {
  const dialogProps = useDialog();
  const { fetchAssessments, ...rest } = useFetchAssessments();
  const { data, error, errorObject, requested_space } = rest;
  const isEmpty = data.length == 0;

  return error &&
    (errorObject?.type === ECustomErrorType.ACCESS_DENIED ||
      errorObject?.type === ECustomErrorType.NOT_FOUND) ? (
    <NotFoundOrAccessDenied />
  ) : (
    <Box display="flex" flexDirection="column" m="auto">
      <Title
        borderBottom={true}
        sup={requested_space || ""}
        toolbar={
          <ToolbarCreateItemBtn
            onClick={dialogProps.openDialog}
            icon={<AddchartRoundedIcon />}
            shouldAnimate={isEmpty}
            minWidth="195px"
            text="createAssessment"
          />
        }
      >
        <Trans i18nKey="assessments" />
      </Title>
      <QueryData
        {...rest}
        renderLoading={() => <LoadingSkeletonOfAssessments />}
        emptyDataComponent={
          <EmptyError
            emptyMessage={<Trans i18nKey="nothingToSeeHere" />}
            suggests={
              <Typography variant="subtitle1" textAlign="center">
                <Trans i18nKey="tryCreatingNewAssessment" />
              </Typography>
            }
          />
        }
        render={(data) => {
          return (
            <AssessmentsList {...rest} data={data} dialogProps={dialogProps} />
          );
        }}
      />
      <CreateAssessmentDialog
        {...dialogProps}
        onSubmitForm={fetchAssessments}
      />
    </Box>
  );
};

const useFetchAssessments = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorObject, setErrorObject] = useState<undefined | ICustomError>(
    undefined
  );
  const { spaceId } = useParams();
  const { service } = useServiceContext();
  const abortController = useRef(new AbortController());

  useEffect(() => {
    fetchAssessments();
    return () => {
      abortController.current.abort();
    };
  }, []);

  const fetchAssessments = async () => {
    setLoading(true);
    setErrorObject(undefined);
    try {
      const { data: res } = await service.fetchAssessments(
        { spaceId },
        { signal: abortController.current.signal }
      );
      if (res) {
        setData(res);
        setError(false);
      } else {
        setData({});
        setError(true);
      }

      setLoading(false);
    } catch (e) {
      const err = e as ICustomError;
      toastError(err, { filterByStatus: [404] });
      setLoading(false);
      setError(true);
      setErrorObject(err);
    }
  };

  const deleteAssessment = async (id: any) => {
    setLoading(true);
    try {
      const { data: res } = await service.deleteAssessment(
        { id },
        { signal: abortController.current.signal }
      );
      fetchAssessments();
    } catch (e) {
      const err = e as ICustomError;
      toastError(err);
      setLoading(false);
      setError(true);
    }
  };

  return {
    data: data.results || [],
    requested_space: data.requested_space,
    loading,
    loaded: !!data,
    error,
    errorObject,
    fetchAssessments,
    deleteAssessment,
  };
};

export default AssessmentContainer;
