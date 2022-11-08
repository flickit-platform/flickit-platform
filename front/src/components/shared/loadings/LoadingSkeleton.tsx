import React from "react";
import Skeleton, { SkeletonProps } from "@mui/material/Skeleton";

export const LoadingSkeleton = (props: SkeletonProps) => {
  return (
    <Skeleton
      variant="rectangular"
      {...props}
      sx={{ borderRadius: 2, ...(props?.sx || {}) }}
    />
  );
};
