import React from "react";
import { QuestionnaireCard } from "./QuestionnaireCard";
import QueryData from "../shared/QueryData";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import { IQuestionnairesModel, TQueryData } from "../../types";
import LoadingSkeletonOfQuestionnaires from "../shared/loadings/LoadingSkeletonOfQuestionnaires";

interface IQuestionnaireListProps {
  questionnaireQueryData: TQueryData<IQuestionnairesModel>;
}

export const QuestionnaireList = (props: IQuestionnaireListProps) => {
  const { questionnaireQueryData } = props;

  return (
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
    ></QueryData>
  );
};
