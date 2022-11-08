import React from "react";
import Box from "@mui/material/Box";
import { Trans } from "react-i18next";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Empty, Title } from "../../components";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import { styles } from "../../config/styles";

interface IAssessmentMostSignificantAttributesProps {
  most_significant_items: string[];
  isWeakness: boolean;
}

export const AssessmentMostSignificantAttributes = (
  props: IAssessmentMostSignificantAttributesProps
) => {
  const { most_significant_items = [], isWeakness } = props;
  const isEmpty = most_significant_items.length === 0;

  return (
    <Paper sx={{ height: "100%", borderRadius: 3 }} elevation={3}>
      <Box p={2.5} pb={1}>
        <Box
          sx={{ ...styles.centerV }}
          pb={isEmpty ? "6px" : ""}
          borderBottom={(t) =>
            `1px solid ${
              isWeakness ? t.palette.error.light : t.palette.success.light
            }`
          }
        >
          <Typography
            variant="h3"
            mr={"8px"}
            fontWeight="bold"
            sx={{
              opacity: 0.8,
            }}
          >
            {!isEmpty && most_significant_items.length}
          </Typography>
          <Title
            size="small"
            sx={{
              opacity: 0.8,
              fontSize: { xs: "1.4rem", lg: "1.1rem" },
            }}
          >
            <Trans
              i18nKey={
                isWeakness
                  ? "mostSignificantWeaknesses"
                  : "mostSignificantStrengths"
              }
            />
          </Title>
        </Box>
        <Box display="flex" flexDirection={"column"} mt={4}>
          {isEmpty ? (
            <Empty p={2} hideMessage={true} />
          ) : (
            most_significant_items.map((item, index) => {
              return (
                <Box sx={{ ...styles.centerV }} mb={1} key={index}>
                  <CircleRoundedIcon
                    fontSize="inherit"
                    sx={{ opacity: 0.5, fontSize: "8px" }}
                  />
                  <Typography
                    textTransform={"uppercase"}
                    fontWeight="bold"
                    sx={{ ml: 1 }}
                  >
                    {item}
                  </Typography>
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    </Paper>
  );
};
