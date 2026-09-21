/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL del API NestJS, incluyendo el prefijo `/api`. */
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
