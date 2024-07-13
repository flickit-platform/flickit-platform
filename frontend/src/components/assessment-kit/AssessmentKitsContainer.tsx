import { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Title from "@common/Title";
import AssessmentKitsListContainer from "./AssessmentKitsListContainer";

const AssessmentKitsContainer = (props: PropsWithChildren<{}>) => {
  return (
    <Box>
      <Title size="large">
        <Trans i18nKey="assessmentKits" />
      </Title>

      <Box mt={2}>
        <AssessmentKitsListContainer />
      </Box>
    </Box>
  );
};

export default AssessmentKitsContainer;
