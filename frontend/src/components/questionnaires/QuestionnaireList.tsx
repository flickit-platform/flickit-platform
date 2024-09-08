import React, { useState } from "react";
import { QuestionnaireCard } from "./QuestionnaireCard";
import QueryData from "@common/QueryData";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import {
  TId,
  TQueryFunction,
} from "@types";
import LoadingSkeletonOfQuestionnaires from "@common/loadings/LoadingSkeletonOfQuestionnaires";
import Box from "@mui/material/Box";
import QANumberIndicator from "@common/QANumberIndicator";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { styles } from "@styles";
import { useSearchParams } from "react-router-dom";

interface IQuestionnaireListProps {
  questionnaireQueryData: any;
  assessmentTotalProgress: any;
}

export const QuestionnaireList = (props: IQuestionnaireListProps) => {
  const { questionnaireQueryData, assessmentTotalProgress } = props;
  const { query: fetchQuestionnaires } = questionnaireQueryData;

  return (
    <>
      <Box display={"flex"} justifyContent="space-between">
        {/* <QueryData
          {...(pageQueryData || {})}
          errorComponent={<></>}
          renderLoading={() => {
            return (
              <Box height="100%" sx={{ ...styles.centerV, pl: 1 }}>
                {[1, 2, 3].map((item) => {
                  return <LoadingSkeleton height="36px" width="70px" key={item} sx={{ ml: 1 }} />;
                })}
              </Box>
            );
          }}
          render={(data) => {
            const { subjects = [] } = data;
            return <FilterBySubject fetchQuestionnaires={fetchQuestionnaires} subjects={subjects} />;
          }}
        /> */}

        <Box
          minWidth="130px"
          display="flex"
          justifyContent={"flex-end"}
          sx={{
            position: {
              xs: "absolute",
              sm: "static",
              top: "8px",
              right: "14px",
            },
          }}
        >
          <QueryData
            {...(assessmentTotalProgress || {})}
            errorComponent={<></>}
            renderLoading={() => <Skeleton width="60px" height="36px" />}
            render={(data) => {
              const { questionsCount = 0, answersCount = 0 } = data || {};
              return (
                <QANumberIndicator
                  color="white"
                  q={questionsCount}
                  a={answersCount}
                  variant="h6"
                />
              );
            }}
          />
        </Box>
      </Box>
      <Box>
        <Divider sx={{ borderColor: "white", opacity: 0.4, mt: 1, mb: 1 }} />
        <Box pb={2}>
          <QueryData
            {...(questionnaireQueryData || {})}
            isDataEmpty={(data) => data.questionaries_info?.length === 0}
            renderLoading={() => <LoadingSkeletonOfQuestionnaires />}
            render={(data) => {
              const { items } = data;
              return (
                <Grid container spacing={2}>
                  {items.map((data: any) => {
                    return (
                      <Grid item xl={4} md={6} sm={12} xs={12} key={data.id}>
                        <QuestionnaireCard data={data} />
                      </Grid>
                    );
                  })}
                </Grid>
              );
            }}
          />
        </Box>
      </Box>
    </>
  );
};

const FilterBySubject = (props: {
  subjects: { id: TId; title: string }[];
  fetchQuestionnaires: TQueryFunction;
}) => {
  const { subjects, fetchQuestionnaires } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const subjectIdParam = searchParams.get("subject_pk");
  const [activeFilterSubjectId, setActiveFilterSubjectId] =
    useState(subjectIdParam);

  const handleClick = (subjectId: TId) => {
    if (activeFilterSubjectId == subjectId) {
      fetchQuestionnaires({ subject_pk: null });
      setSearchParams(
        (searchParams) => {
          searchParams.delete("subject_pk");
          return searchParams;
        },
        { replace: true }
      );
      setActiveFilterSubjectId(null);
    } else {
      fetchQuestionnaires({ subject_pk: subjectId });
      setSearchParams(
        (searchParams) => {
          searchParams.set("subject_pk", subjectId.toString());
          return searchParams;
        },
        { replace: true }
      );
      setActiveFilterSubjectId(subjectId.toString());
    }
  };

  return (
    <Box height="100%" sx={{ ...styles.centerV, pl: 1 }}>
      {subjects.map((subject: any) => {
        return (
          <FilterButton
            key={subject.id}
            subject={subject}
            handleClick={handleClick}
            active={activeFilterSubjectId == subject?.id}
          />
        );
      })}
    </Box>
  );
};

const FilterButton = (props: {
  subject: { id: TId; title: string };
  handleClick: (subjectId: TId) => void;
  active: boolean;
}) => {
  const { subject, handleClick, active } = props;
  const { title, id } = subject;

  return (
    <Button
      color="inherit"
      sx={{
        backgroundColor: active ? "#ffffff3b" : undefined,
        mr: 1,
        "&:hover": {
          backgroundColor: active ? "#ffffff66" : "#ffffff11",
        },
      }}
      onClick={() => handleClick(id)}
    >
      {title}
    </Button>
  );
};
