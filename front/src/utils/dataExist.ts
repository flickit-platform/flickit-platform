import { object } from "yup";

const dataExist = (data: any) => {
  if (!data) {
    return false;
  }
  if (Array.isArray(data) && data.length == 0) {
    return false;
  }
  if (typeof data === "object" && Object.keys(data).length === 0) {
    return false;
  }
  return true;
};

export default dataExist;
