import Box from "@mui/material/Box";
import Title from "@common/Title";
import QueryData from "@common/QueryData";
import { Trans } from "react-i18next";
import Skeleton from "@mui/material/Skeleton";
import SubjectAttributeCard from "./SubjectAttributeCard";

export const SubjectAttributeList = (props: any) => {
  const { data } = props;
  const { subject,attributes} = data;

  return (
    <Box mt={15} id="attributes">
      <Title sx={{ opacity: 0.8, fontSize: "1.7rem" }} inPageLink="attributes">
        {subject?.title} <Trans i18nKey="attributes" />
      </Title>
      <Box mt={3}>
        {/* renderLoading={() => {
            return [1, 2, 3, 4, 5].map((item) => {
              return <Skeleton key={item} variant="rectangular" height="260px" sx={{ mb: 2, borderRadius: 2 }} />;
            });
          }} */}

        {attributes.map((result: any = {}) => {
          return (
            <SubjectAttributeCard
              maturity_levels_count={subject?.maturity_level?.maturity_levels_count}
              {...result}
              key={result.id}
            />
          );
        })}
      </Box>
    </Box>
  );
};
