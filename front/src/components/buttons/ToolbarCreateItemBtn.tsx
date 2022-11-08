import React from "react";
import Button from "@mui/material/Button";
import useScreenResize from "../../utils/useScreenResize";
import { animations } from "../../config/styles";
import { Trans } from "react-i18next";

interface IToolbarCreateItemBtnProps {
  icon?: JSX.Element;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  shouldAnimate?: boolean;
  text: `create${string}`;
  minWidth?: string;
}

export const ToolbarCreateItemBtn = (props: IToolbarCreateItemBtnProps) => {
  const { icon, shouldAnimate, onClick, text, minWidth } = props;
  const isSmallScreen = useScreenResize("sm");

  return (
    <Button
      size="small"
      startIcon={icon}
      onClick={onClick}
      variant="contained"
      sx={{
        mb: "1px",
        minWidth: isSmallScreen ? undefined : minWidth,
        animation: shouldAnimate
          ? `${animations.pomp} 1.6s infinite cubic-bezier(0.280, 0.840, 0.420, 1)`
          : undefined,
        "&:hover": {
          animation: `${animations.noPomp}`,
        },
      }}
    >
      <Trans i18nKey={isSmallScreen ? "create" : text} />
    </Button>
  );
};
