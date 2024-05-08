import Box from "@mui/material/Box";
import Title from "@common/Title"; 
import { Trans } from "react-i18next";
import SubjectAttributeCard from "./SubjectAttributeCard";

export const SubjectAttributeList = (props: any) => {
  const { data } = props;
  const { subject,attributes,maturityLevelsCount} = data;
  const {title}=subject
  return (
    <Box mt={15} id="attributes">
      <Title sx={{ opacity: 0.8, fontSize: "1.7rem" }} inPageLink="attributes">
        {title} <Trans i18nKey="attributes" />
      </Title>
      <Box mt={3}>
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
    </Box>
  );
};
