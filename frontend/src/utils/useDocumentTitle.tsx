import { useLayoutEffect } from "react";
import setDocumentTitle from "./setDocumentTitle";

const useDocumentTitle = (title: string = "") => {
  useLayoutEffect(() => {
    setDocumentTitle(title);
  }, []);
};

export default useDocumentTitle;
