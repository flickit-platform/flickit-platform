/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_KEYCLOACK_URL: string;
  VITE_KEYCLOACK_REALM: string;
  VITE_KEYCLOACK_CLIENT_ID: string;
  VITE_SENTRY_DSN: string;
  VITE_APP_TITLE: string;
  VITE_APP_LOGO_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
