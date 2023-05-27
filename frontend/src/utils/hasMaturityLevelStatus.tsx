const hasMaturityLevelStatus = (maturity_level_status: string) => {
  if (maturity_level_status !== undefined ) {
    return true;
  }
  return false;
};

export default hasMaturityLevelStatus;
