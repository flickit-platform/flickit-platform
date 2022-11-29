import React from "react";
import Box from "@mui/material/Box";
import Title from "../../components/shared/Title";
import QueryData from "../../components/shared/QueryData";
import { Trans } from "react-i18next";
import Skeleton from "@mui/material/Skeleton";
import SubjectAttributeCard from "./SubjectAttributeCard";

export const SubjectAttributeList = (props: any) => {
  const { data } = props;
  return (
    <Box mt={15} id="attributes">
      <Title sx={{ opacity: 0.8, fontSize: "1.7rem" }} inPageLink="attributes">
        {data?.title} <Trans i18nKey="attributes" />
      </Title>
      <Box mt={3}>
        <QueryData
          {...props}
          renderLoading={() => {
            return [1, 2, 3, 4, 5].map((item) => {
              return (
                <Skeleton
                  key={item}
                  variant="rectangular"
                  height="260px"
                  sx={{ mb: 2, borderRadius: 2 }}
                />
              );
            });
          }}
          render={(data) => {
            const { results = [] } = data;
            return results.map((result: any = {}) => {
              return <SubjectAttributeCard {...result} key={result.id} />;
            });
          }}
        />
      </Box>
    </Box>
  );
};
