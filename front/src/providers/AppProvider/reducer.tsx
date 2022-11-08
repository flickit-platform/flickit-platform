import { APP_ACTIONS_TYPE } from "./actions";

const appReducer = (
  prevState: any,
  action: { type: APP_ACTIONS_TYPE; payload: any }
) => {
  switch (action.type) {
    default:
      return prevState;
  }
};

export default appReducer;
