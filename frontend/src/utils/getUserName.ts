import { IUserInfo } from "../types";

const getUserName = (userInfo: IUserInfo) => {
  if (!userInfo) {
    return "";
  }
  if (userInfo.first_name && userInfo.last_name) {
    return `${userInfo.first_name} ${userInfo.last_name}`;
  }
  return userInfo.username;
};

export default getUserName;
