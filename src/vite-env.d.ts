/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_AI_MODE: string;
  readonly VITE_PAYMENT_MODE: string;
  readonly VITE_STORAGE_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
