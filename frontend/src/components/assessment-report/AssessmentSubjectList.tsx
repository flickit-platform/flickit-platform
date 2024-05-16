import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import ErrorEmptyData from "@common/errors/ErrorEmptyData";
import Title from "@common/Title";
import { AssessmentSubjectAccordion } from "./AssessmentSubjectCard";
import Grid from "@mui/material/Grid";
import { ISubjectInfo } from "@types";
interface IAssessmentSubjectListProps {
  subjects: ISubjectInfo[];
  colorCode: string;
}

export const AssessmentSubjectList = (props: IAssessmentSubjectListProps) => {
  const { subjects = [], colorCode } = props;
  const isEmpty = subjects.length === 0;

  return (
    <Box mt={4}>
      <Box mt={3}>
        {isEmpty ? (
          <ErrorEmptyData />
        ) : (
          <Grid container spacing={3}>
            {subjects.map((subject) => {
              return (
                <Grid item xs={12} sm={12} md={12} lg={12} key={subject?.id}>
                  <AssessmentSubjectAccordion
                    {...subject}
                    colorCode={colorCode}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
};
