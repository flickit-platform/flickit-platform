/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_SSO_URL: string;
  VITE_SSO_REALM: string;
  VITE_SSO_CLIENT_ID: string;
  VITE_SENTRY_DSN: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
