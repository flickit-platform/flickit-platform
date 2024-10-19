import { APP_ACTIONS_TYPE } from "./actions";

const appReducer = (
  prevState: any,
  action: { type: APP_ACTIONS_TYPE; payload: any },
) => {
  if (action.type) {
    return prevState;
  }
};

export default appReducer;
