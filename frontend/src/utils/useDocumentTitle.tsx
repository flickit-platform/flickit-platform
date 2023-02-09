import { useLayoutEffect } from "react";
import setDocumentTitle from "./setDocumentTitle";

const useDocumentTitle = (title: string = "") => {
  useLayoutEffect(() => {
    setDocumentTitle(title);
  }, []);

  return setDocumentTitle;
};

export default useDocumentTitle;
