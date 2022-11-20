import { useState } from "react";

interface IUseDialogProps {
  context?: any;
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
    if (context) {
      setContext(context);
    }
  };

  return { open, onClose, openDialog, context };
};

export type TDialogProps = ReturnType<typeof useDialog>;

export default useDialog;
