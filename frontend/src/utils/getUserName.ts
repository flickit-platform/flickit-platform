import { IUserInfo } from "../types";

const getUserName = (userInfo: IUserInfo) => {
  if (!userInfo) {
    return "";
  }
  return userInfo.display_name || userInfo.email;
};

export default getUserName;
