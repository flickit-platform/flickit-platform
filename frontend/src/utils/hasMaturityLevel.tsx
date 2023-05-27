import { IMaturityLevel } from "@types";
const hasMaturityLevel = (value: number) => {
  if (!value===null) {
    return false;
  }
  return true;
};

export default hasMaturityLevel;
