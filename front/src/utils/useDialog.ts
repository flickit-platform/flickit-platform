import { useState } from "react";
import { IDialogContext } from "../types";

interface IUseDialogProps {
  context?: IDialogContext;
}

const useDialog = (props: IUseDialogProps = {}) => {
  const { context: initialContext = undefined } = props;
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState(initialContext);

  const onClose = () => {
    setOpen(false);
  };

  const openDialog = (context: undefined | any) => {
    setOpen(true);
    if (context.type && !context.target) {
      setContext(context);
    }
  };

  return { open, onClose, openDialog, context };
};

export type TDialogProps = ReturnType<typeof useDialog>;

export default useDialog;
