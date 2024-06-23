import { useLayoutEffect } from "react";
import setDocumentTitle from "./setDocumentTitle";
import { useAppConfigContext } from "@/providers/AppActions";

const useDocumentTitle = (title: string = "") => {
  const { state } = useAppConfigContext();
  useLayoutEffect(() => {
    setDocumentTitle(title, state.appTitle);
  }, []);

  return setDocumentTitle;
};

export default useDocumentTitle;
