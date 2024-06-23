export const ActionTypes = {
  SET_APP_TITLE: "SET_APP_TITLE",
  SET_APP_LOGO_URL: "SET_APP_LOGO_URL",
};
export const setAppTitle = (title: string) => ({
  type: ActionTypes.SET_APP_TITLE,
  payload: title,
});

export const setAppLogoUrl = (url: string) => ({
  type: ActionTypes.SET_APP_LOGO_URL,
  payload: url,
});
