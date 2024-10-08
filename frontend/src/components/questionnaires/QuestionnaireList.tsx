import { QuestionnaireCard } from "./QuestionnaireCard";
import QueryData from "@common/QueryData";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import LoadingSkeletonOfQuestionnaires from "@common/loadings/LoadingSkeletonOfQuestionnaires";
import Box from "@mui/material/Box";
import QANumberIndicator from "@common/QANumberIndicator";
import Divider from "@mui/material/Divider";

interface IQuestionnaireListProps {
  questionnaireQueryData: any;
  assessmentTotalProgress: any;
}

export const QuestionnaireList = (props: IQuestionnaireListProps) => {
  const { questionnaireQueryData, assessmentTotalProgress } = props;

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
              const { items, permissions } = data;
              return (
                <Grid container spacing={2}>
                  {items.map((data: any) => {
                    return (
                      <Grid item xl={4} md={6} sm={12} xs={12} key={data.id}>
                        <QuestionnaireCard
                          data={data}
                          permissions={permissions}
                        />
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

