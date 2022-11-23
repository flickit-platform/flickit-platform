import React from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Title from "../shared/Title";
import CompareParts from "./CompareParts";
import CompareRoundedIcon from "@mui/icons-material/CompareRounded";

const CompareContainer = () => {
  return (
    <Box>
      <Title borderBottom={true}>
        <CompareRoundedIcon sx={{ mr: 1 }} />
        <Trans i18nKey="compare" />
      </Title>
      <Box mt={3}>
        <CompareParts />
      </Box>
    </Box>
  );
};

export default CompareContainer;
