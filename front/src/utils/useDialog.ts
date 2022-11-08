import { useState } from "react";

const useDialog = () => {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState(undefined);

  const onClose = () => {
    setOpen(false);
  };

  const openDialog = (context: undefined | any) => {
    setOpen(true);
    setContext(context);
  };

  return { open, onClose, openDialog, context };
};

export type TDialogProps = ReturnType<typeof useDialog>;

export default useDialog;
