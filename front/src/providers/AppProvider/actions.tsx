export enum APP_ACTIONS_TYPE {
  AUTHENTICATE_APP = "AUTHENTICATE_APP",
  UNAUTHENTICATED_APP = "UNAUTHENTICATED_APP",
}

export const authenticateApp = () => {
  return { payload: true, type: APP_ACTIONS_TYPE.AUTHENTICATE_APP };
};

export const unAuthenticateApp = () => {
  return { payload: true, type: APP_ACTIONS_TYPE.UNAUTHENTICATED_APP };
};

export const appActions = { authenticateApp, unAuthenticateApp };
