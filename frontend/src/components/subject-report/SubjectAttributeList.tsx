import Box from "@mui/material/Box";
import SubjectAttributeCard from "./SubjectAttributeCard";
import ErrorEmptyData from "../common/errors/ErrorEmptyData";

export const SubjectAttributeList = (props: any) => {
  const { data } = props;
  const { attributes, maturityLevelsCount } = data;
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
