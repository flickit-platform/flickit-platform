import { IMaturityLevel } from "@types";
const hasMaturityLevel = (maturity_level: IMaturityLevel) => {
  const { title, value } = maturity_level;
  if (!title || value === null) {
    return false;
  }
  return true;
};

export default hasMaturityLevel;
