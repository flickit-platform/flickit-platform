import Box from "@mui/material/Box";
import Title from "@common/Title";
import { Trans } from "react-i18next";
import SubjectAttributeCard from "./SubjectAttributeCard";
import { Grid } from "@mui/material";
import ErrorEmptyData from "../common/errors/ErrorEmptyData";

export const SubjectAttributeList = (props: any) => {
  const { data } = props;
  const { subject, attributes, maturityLevelsCount } = data;
  const { title } = subject;
  const isEmpty = attributes.length === 0;

  return (
    <Box>
      {isEmpty ? (
        <ErrorEmptyData />
      ) : (
        <Box display="flex" flexDirection="column" gap="1rem">
          {attributes.map((result: any = {}) => {
            return (
              <SubjectAttributeCard
                maturity_levels_count={maturityLevelsCount}
                {...result}
                key={result.id}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};
