/**
 * API Configuration
 *
 * Centralized config for backend API URLs.
 * Uses NEXT_PUBLIC_API_BASE_URL env variable to determine the backend target.
 *
 * Dev:        http://127.0.0.1:4040   (default when no env is set)
 * Production: https://api.urekha.com  (set via .env.production or hosting platform)
 *
 * Usage:
 *   import { API_BASE_URL } from "@/lib/config/api";
 *   fetch(`${API_BASE_URL}/predict/...`)
 */

const DEV_URL = "http://127.0.0.1:4040";
const PROD_URL = "https://api.urekha.com";

/**
 * Resolved backend API base URL.
 *
 * Priority:
 *  1. NEXT_PUBLIC_API_BASE_URL env variable (explicit override)
 *  2. NODE_ENV === "production" → PROD_URL
 *  3. Fallback → DEV_URL
 */
export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "production" ? PROD_URL : DEV_URL);

/** True when running against the production backend */
export const isProduction = API_BASE_URL === PROD_URL;

/** True when running against the local dev backend */
export const isDevelopment = !isProduction;
