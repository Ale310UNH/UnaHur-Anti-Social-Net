/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  // agrega más variables que uses, por ejemplo:
  // readonly VITE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}