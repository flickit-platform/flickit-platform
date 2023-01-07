import { Button, Dialog, DialogTitle } from "@mui/material";

import useDialog from "../../../utils/useDialog";
import { IDialogProps } from "../../../types";

export interface IRichEditorMenuItem {
  icon?: JSX.Element;
  title: string;
  action?: (props: IDialogProps) => any;
  isActive?: () => boolean;
  type?: "divider";
  prompt?: {
    title: string;
    promptBody: (closeModal: () => void) => JSX.Element;
  };
}

interface IRichEditorMenuItemProps {
  menuItem: IRichEditorMenuItem;
}

const RichEditorMenuItem = (props: IRichEditorMenuItemProps) => {
  const {
    menuItem: { icon, title, action, isActive = false, prompt },
  } = props;

  const dialogProps = useDialog();

  return (
    <>
      <Button
        id={`proseMirror-menu-btn`}
        sx={{
          minWidth: "34px",
          minHeight: "34px",
          m: 0.1,
          mx: 0,
          color: "GrayText",
          background: isActive && isActive() ? "#dddddd" : undefined,
          "&:hover": {
            background: isActive && isActive() ? "#cccccc" : undefined,
          },
        }}
        size="small"
        type="button"
        onClick={(e) => {
          action?.(dialogProps);
        }}
        title={title}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {icon || title}
      </Button>
      {prompt && <PromptForm {...dialogProps} prompt={prompt} />}
    </>
  );
};

const PromptForm = (
  props: IDialogProps & {
    prompt: {
      title: string;
      promptBody: (closeModal: () => void) => JSX.Element;
    };
  }
) => {
  const { onClose, open, prompt } = props;
  const { promptBody, title } = prompt;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      {promptBody(onClose)}
    </Dialog>
  );
};

export default RichEditorMenuItem;
