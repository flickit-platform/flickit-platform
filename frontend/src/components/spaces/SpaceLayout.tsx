import React, { PropsWithChildren } from "react";
import Box from "@mui/material/Box";

interface ISpaceLayoutProps {
  title?: JSX.Element;
}

const SpaceLayout = (props: PropsWithChildren<ISpaceLayoutProps>) => {
  const { title, children } = props;

  return (
    <Box display="flex" flexDirection="column" m="auto">
      <Box>{title}</Box>
      <Box>{children}</Box>
    </Box>
  );
};

export { SpaceLayout };
