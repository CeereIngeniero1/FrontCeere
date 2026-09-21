/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL del API NestJS, incluyendo el prefijo `/api`. */
  readonly VITE_API_URL: string
  /**
   * `demo` = auth temporal sin cookies (desarrollo UI).
   * `api` = login/me/logout/refresh reales con cookies HTTP-only.
   */
  readonly VITE_AUTH_MODE?: 'demo' | 'api'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
