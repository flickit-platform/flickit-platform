/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_KEYCLOACK_URL: string;
  VITE_KEYCLOACK_REALM: string;
  VITE_KEYCLOACK_CLIENT_ID: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
