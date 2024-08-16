import { IUserInfo } from "@types";

const getUserName = (userInfo: IUserInfo) => {
  if (!userInfo) {
    return "";
  }
  return userInfo.displayName || userInfo.email;
};

export default getUserName;
