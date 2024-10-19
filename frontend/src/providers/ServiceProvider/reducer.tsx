import { SERVICE_ACTIONS_TYPE } from "./actions";

const serviceReducer = (
  prevState: any,
  action: { type: SERVICE_ACTIONS_TYPE; payload: any },
) => {
  if (action.type) {
    return prevState;
  }
};

export default serviceReducer;
