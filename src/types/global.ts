// Global type definitions - cleaned up to avoid conflicts

export interface DatabaseConnection {
  connected: boolean;
  host: string;
  database: string;
}

export interface AppConfig {
  baseUrl: string;
  apiVersion: string;
  supportedLocales: readonly string[];
  defaultLocale: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface PageProps {
  params: { [key: string]: string | string[] };
  searchParams: SearchParams;
}

// Minimal global augmentation to avoid conflicts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DATABASE_URL: string;
      NEXTAUTH_SECRET?: string;
      NEXTAUTH_URL?: string;
      readonly NEXT_PUBLIC_BASE_URL: string;
      readonly OPENAI_API_KEY?: string;
      readonly NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};