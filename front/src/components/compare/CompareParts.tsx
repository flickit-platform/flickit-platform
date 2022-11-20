import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ComparePartItem from "./ComparePartItem";
import { useServiceContext } from "../../providers/ServiceProvider";
import { useQuery } from "../../utils/useQuery";
import QueryData from "../shared/QueryData";
import Button from "@mui/material/Button";
import { Trans } from "react-i18next";
import { LoadingSkeleton } from "../shared/loadings/LoadingSkeleton";
import { ICompareModel } from "../../types";

const CompareParts = () => {
  const { compareQueryData } = useCompareParts();

  return (
    <Box>
      <Box position={"relative"}>
        <QueryData
          {...compareQueryData}
          renderLoading={() => {
            return (
              <>
                <CompareButton disabled={true} />
                <Grid container spacing={3}>
                  {[0, 1, 2, 3].map((index) => {
                    return (
                      <Grid item xs={12} sm={6} key={index}>
                        <LoadingSkeleton height="264px" />
                      </Grid>
                    );
                  })}
                </Grid>
              </>
            );
          }}
          render={(data) => {
            const { assessment_project_compare_list } = data;
            return (
              <>
                <CompareButton />
                <Grid container spacing={3}>
                  {[0, 1, 2, 3].map((index) => {
                    const data = assessment_project_compare_list[index];
                    return (
                      <Grid item xs={12} sm={6} key={index}>
                        <ComparePartItem
                          data={data}
                          fetchCompare={compareQueryData.query}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </>
            );
          }}
        />
      </Box>
    </Box>
  );
};

const useCompareParts = () => {
  const { service } = useServiceContext();
  const compareQueryData = useQuery<ICompareModel>({
    service: (args, config) => service.fetchCompare(args, config),
  });

  return { compareQueryData };
};

const CompareButton = (props: { disabled?: boolean }) => {
  const { disabled = false } = props;
  return (
    <>
      <Button
        variant="contained"
        size="large"
        disabled={disabled}
        sx={{
          position: "absolute",
          borderRadius: "100%",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,calc(-50% + 12px))",
          width: "96px",
          height: "96px",
          zIndex: 2,
        }}
      >
        <Trans i18nKey="compare" />
      </Button>
      <Box
        sx={{
          position: "absolute",
          borderRadius: "100%",
          left: "50%",
          top: "50%",
          background: "white",
          transform: "translate(-50%,calc(-50% + 12px))",
          width: "110px",
          height: "110px",
          zIndex: 1,
        }}
      />
    </>
  );
};

export default CompareParts;
