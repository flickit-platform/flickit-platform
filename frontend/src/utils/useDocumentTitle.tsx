import { useLayoutEffect } from "react";
import setDocumentTitle from "./setDocumentTitle";
import { useConfigContext } from "@/providers/ConfgProvider";

const useDocumentTitle = (title: string = "") => {
  const { config } = useConfigContext();
  useLayoutEffect(() => {
    setDocumentTitle(title, config.appTitle);
  }, []);

  return setDocumentTitle;
};

export default useDocumentTitle;
