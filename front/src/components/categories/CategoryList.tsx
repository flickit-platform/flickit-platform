import React from "react";
import { CategoryCard } from "./CategoryCard";
import QueryData from "../shared/QueryData";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

export const CategoryList = (props: any) => {
  const { subjectQueryData = {} } = props;

  return (
    <QueryData
      {...subjectQueryData}
      renderLoading={() => {
        return (
          <Grid container spacing={2} mt={2}>
            {[1, 2, 3, 4, 5].map((item) => {
              return (
                <Grid item xl={4} md={6} sm={12} xs={12} key={item}>
                  <Skeleton
                    height="153px"
                    variant="rectangular"
                    sx={{ borderRadius: 2 }}
                  />
                </Grid>
              );
            })}
          </Grid>
        );
      }}
      isDataEmpty={(data: any = {}) => {
        const { metric_categories_info } = data;
        if (!metric_categories_info || metric_categories_info?.length === 0) {
          return true;
        }
        return false;
      }}
      render={(data: any = {}) => {
        const { metric_categories_info = [] } = data;
        return (
          <Grid container spacing={2}>
            {metric_categories_info.map((data: any) => {
              return (
                <Grid item xl={4} md={6} sm={12} xs={12} key={data.id}>
                  <CategoryCard data={data} />
                </Grid>
              );
            })}
          </Grid>
        );
      }}
    ></QueryData>
  );
};
