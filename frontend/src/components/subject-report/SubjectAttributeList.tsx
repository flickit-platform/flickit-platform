import Box from "@mui/material/Box";
import Title from "@common/Title";
import { Trans } from "react-i18next";
import SubjectAttributeCard from "./SubjectAttributeCard";

export const SubjectAttributeList = (props: any) => {
  const { data } = props;
  const { subject, attributes, maturityLevelsCount } = data;
  const { title } = subject;
  return (
    <Box id="attributes">
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
  );
};
