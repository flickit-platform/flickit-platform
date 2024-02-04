import Keycloak, { KeycloakInstance } from "keycloak-js";
// const _kc: KeycloakInstance = new Keycloak("/keycloak.json");
const _kc: KeycloakInstance = new Keycloak({
  url: "https://test.flickit.org/accounts",
  realm: "flickit",
  clientId: "flickit-frontend",
});
/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */

const initKeycloak = (onAuthenticatedCallback: () => void) => {
  _kc
    .init({
      onLoad: "login-required",
      pkceMethod: "S256",
    })
    .then((authenticated) => {
      if (!authenticated) {
        doLogin();
      }
      onAuthenticatedCallback();
    })
    .catch(console.error);
};
const isTokenExpired = _kc.isTokenExpired;
const doLogin = _kc.login;

const doLogout = _kc.logout;

const getToken = (): string => _kc?.token ?? "";

const getTokenParsed = (): Record<string, any> | null =>
  _kc?.tokenParsed ?? null;

const isLoggedIn = (): boolean => !!_kc.token;

const updateToken = (successCallback: () => void) =>
  _kc.updateToken(30).then(successCallback).catch(doLogin);

const keycloakService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getTokenParsed,
  updateToken,
  isTokenExpired,
  _kc,
};

export default keycloakService;
