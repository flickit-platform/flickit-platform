import Keycloak, { KeycloakInstance } from "keycloak-js";
import {
  KEYCLOACK_URL,
  KEYCLOACK_REALM,
  KEYCLOACK_CLIENT_ID,
} from "@constants";
// const _kc: KeycloakInstance = new Keycloak("/keycloak.json");
const _kc: KeycloakInstance = new Keycloak({
  url: KEYCLOACK_URL,
  realm: KEYCLOACK_REALM ?? "flickit",
  clientId: KEYCLOACK_CLIENT_ID ?? "flickit-frontend",
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

const doLogin = _kc.login;

const doLogout = _kc.logout;

const getToken = (): string => _kc?.token ?? "";

const getTokenParsed = (): Record<string, any> | null =>
  _kc?.tokenParsed ?? null;

const isLoggedIn = (): boolean => !!_kc.token;

const updateToken = (successCallback: () => void) =>
  _kc.updateToken(5).then(successCallback).catch(doLogin);

const keycloakService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getTokenParsed,
  updateToken,
};

export default keycloakService;
