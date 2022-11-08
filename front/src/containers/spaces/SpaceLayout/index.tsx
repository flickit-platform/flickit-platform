import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React, { PropsWithChildren } from "react";
import { Trans } from "react-i18next";
import { Title } from "../../../components";
import useDialog from "../../../utils/useDialog";
import CreateSpaceDialog from "../CreateSpaceDialog";

interface ISpaceLayoutProps {
  title?: JSX.Element;
}

const SpaceLayout = (props: PropsWithChildren<ISpaceLayoutProps>) => {
  const dialogProps = useDialog();
  const { title, children } = props;

  return (
    <Box display="flex" flexDirection="column" m="auto">
      <Box>{title}</Box>
      <Box>{children}</Box>
    </Box>
  );
};

export { SpaceLayout };
