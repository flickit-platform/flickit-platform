import React, { useState } from "react";
import { QuestionnaireCard } from "./QuestionnaireCard";
import QueryData from "../shared/QueryData";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import {
  IQuestionnairesModel,
  ISubjectInfo,
  TId,
  TQueryData,
  TQueryFunction,
} from "../../types";
import LoadingSkeletonOfQuestionnaires from "../shared/loadings/LoadingSkeletonOfQuestionnaires";
import Box from "@mui/material/Box";
import QANumberIndicator from "../shared/QANumberIndicator";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { styles } from "../../config/styles";
import { useSearchParams } from "react-router-dom";

interface IQuestionnaireListProps {
  questionnaireQueryData: TQueryData<IQuestionnairesModel>;
}

export const QuestionnaireList = (props: IQuestionnaireListProps) => {
  const { questionnaireQueryData } = props;
  const { query: fetchQuestionnaires } = questionnaireQueryData;

  return (
    <>
      <Box display={"flex"} justifyContent="space-between">
        <FilterBySubject
          fetchQuestionnaires={fetchQuestionnaires}
          subjects={undefined}
        />
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
            {...(questionnaireQueryData || {})}
            errorComponent={<></>}
            renderLoading={() => <Skeleton width="60px" height="36px" />}
            render={(data) => {
              const { total_metric_number = 0, total_answered_metric = 0 } =
                data;
              return (
                <QANumberIndicator
                  color="white"
                  q={total_metric_number}
                  a={total_answered_metric}
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
            renderLoading={() => <LoadingSkeletonOfQuestionnaires />}
            render={(data) => {
              const { results = [] } = data;
              return (
                <Grid container spacing={2}>
                  {results.map((data) => {
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
  subjects?: ISubjectInfo[];
  fetchQuestionnaires: TQueryFunction;
}) => {
  const {
    subjects = [
      { id: 3, title: "Team" },
      { id: 2, title: "Operation" },
    ],
    fetchQuestionnaires,
  } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const subjectIdParam = searchParams.get("subjectId");
  const [activeFilterSubjectId, setActiveFilterSubjectId] =
    useState(subjectIdParam);

  const handleClick = (subjectId: TId) => {
    if (activeFilterSubjectId == subjectId) {
      fetchQuestionnaires({ subjectId: null });
      setSearchParams((searchParams) => {
        searchParams.delete("subjectId");
        return searchParams;
      });
      setActiveFilterSubjectId(null);
    } else {
      fetchQuestionnaires({ subjectId });
      setSearchParams((searchParams) => {
        searchParams.set("subjectId", subjectId.toString());
        return searchParams;
      });
      setActiveFilterSubjectId(subjectId.toString());
    }
  };

  return (
    <Box height="100%" sx={{ ...styles.centerV, pl: 1 }}>
      {subjects.map((subject: any) => {
        return (
          <FilterButton
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
  subject: ISubjectInfo;
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
