import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import { IMaturityLevel } from "@/types";

interface MaturityLevelItemProps {
  item: IMaturityLevel;
}

const MaturityLevelItem: React.FC<MaturityLevelItemProps> = ({ item }) => {
  return (
    <Box display="flex">
      <Typography>{item.index}</Typography>
      <Typography>{item.title}</Typography>
      <Typography>{item.description}</Typography>
      <IconButton>
        <SwapVertRoundedIcon />
      </IconButton>
    </Box>
  );
};

export default MaturityLevelItem;
