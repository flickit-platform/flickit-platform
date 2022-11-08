import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CircularProgress from "@mui/material/CircularProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Trans } from "react-i18next";

interface ICardActionsProps {
  boxProps?: BoxProps;
  open: boolean;
  openMenu: (e: any) => void;
  closeMenu: (e: any) => void;
  loading?: boolean;
  hideInnerIconButton?: boolean;
  anchorEl?: Element | ((element: Element) => Element) | null | undefined;
  items: (
    | {
        icon?: JSX.Element;
        onClick?: React.MouseEventHandler<HTMLLIElement> | undefined;
        text: JSX.Element;
      }
    | null
    | undefined
    | false
  )[];
}

export const CardActions = (props: ICardActionsProps) => {
  const {
    boxProps = {},
    openMenu,
    closeMenu,
    loading = false,
    open,
    anchorEl,
    items = [],
    hideInnerIconButton = false,
  } = props;
  return items.length > 0 ? (
    <Box {...boxProps}>
      {!hideInnerIconButton && (
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            !loading && openMenu(e);
          }}
        >
          {loading ? (
            <CircularProgress size="20px" />
          ) : (
            <MoreVertIcon fontSize="small" />
          )}
        </IconButton>
      )}

      <Menu open={open} onClose={closeMenu} anchorEl={anchorEl}>
        {items.map((item, index) => {
          if (!item) {
            return null;
          }
          const { onClick = () => {}, icon, text } = item;
          return (
            <MenuItem
              key={index}
              onClick={(e) => {
                closeMenu(e);
                onClick(e);
              }}
            >
              {icon && <ListItemIcon>{icon}</ListItemIcon>}
              <ListItemText>{text}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  ) : null;
};
