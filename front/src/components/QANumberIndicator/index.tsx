import Typography, { TypographyProps } from "@mui/material/Typography";
import React from "react";

interface IQANumberIndicatorProps extends TypographyProps {
  q?: number;
  a?: number;
}

export const QANumberIndicator = (props: IQANumberIndicatorProps) => {
  const { q = 0, a = 0, ...rest } = props;
  return q === undefined ? null : (
    <Typography
      variant="body1"
      fontWeight={"bold"}
      color="GrayText"
      letterSpacing={".04rem"}
      {...rest}
    >
      <span style={{ opacity: 0.7 }}>A</span>
      {a} / <span style={{ opacity: 0.7 }}>Q</span>
      {q}
    </Typography>
  );
};
