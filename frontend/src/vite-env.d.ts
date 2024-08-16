/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_SSO_URL: string;
  VITE_SSO_REALM: string;
  VITE_SSO_CLIENT_ID: string;
  VITE_SENTRY_DSN: string;
  VITE_SENTRY_ENVIRONMENT: string;
  VITE_NOVU_BACKEND_URL: string;
  VITE_NOVU_SOCKET_URL: string;
  VITE_NOVU_APPLICATION_IDENTIFIER: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
