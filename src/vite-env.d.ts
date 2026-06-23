/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_PING?: string
  readonly VITE_BASE?: string
  readonly VITE_ADMIN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
