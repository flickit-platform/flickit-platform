import React from "react";
import Chip, { ChipProps } from "@mui/material/Chip";
import getProgressLabel from "../../utils/getProgressLabel";

interface IProgressChip extends ChipProps {
  progress: number;
}

const ProgressChip = (props: IProgressChip) => {
  const { progress, ...rest } = props;
  return <Chip {...rest} label={getProgressLabel(progress)} />;
};

export default ProgressChip;
