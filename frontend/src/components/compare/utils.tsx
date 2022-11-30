import { GridSize } from "@mui/material/Grid";

export const calcGridSizeBasedOnTheLengthOfAssessments = (
  length: number
): GridSize => {
  const gridSize = 12 / (length || 1);
  return gridSize;
};

export const getMinWithBaseOnNumberOfAssessments = (length: number) => {
  return length === 4 ? "760px" : length === 3 ? "550px" : "320px";
};
