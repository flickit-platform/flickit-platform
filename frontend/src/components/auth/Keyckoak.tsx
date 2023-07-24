import Keycloak from "keycloak-js";
import { useEffect } from "react";
const initOptions = {
  url: "http://192.168.0.217:8080",
  realm: "myrealm",
  clientId: "myclient",
};
const keycloak = new Keycloak(initOptions);

export default keycloak;
