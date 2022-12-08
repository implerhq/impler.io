/* eslint-disable @typescript-eslint/naming-convention */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROJECT_ID: string;
  readonly VITE_ACCESS_TOKEN: string;
  readonly VITE_TEMPLATE: string;
  readonly VITE_PRIMARY_COLOR: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
