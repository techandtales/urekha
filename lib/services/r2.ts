/**
 * Cloudflare R2 Storage Service
 *
 * Server-side only (API routes / server actions).
 * DO NOT import this in client components — it uses secret keys.
 *
 * Use cases:
 *   1. Persist Jyotisham API responses (survives Redis expiry & page refresh)
 *   2. Store report images and assets
 *
 * Usage (in API routes or server actions):
 *   import { uploadJSON, downloadJSON, getPublicUrl } from "@/lib/services/r2";
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ── Config (server-side only — never exposed to browser) ──────────────────
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "urekha";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

// ── R2 Client ─────────────────────────────────────────────────────────────
export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// ── Upload JSON Data ──────────────────────────────────────────────────────
/**
 * Persist any JSON-serializable data to R2.
 * Perfect for Jyotisham pipeline results, prediction responses, etc.
 *
 * @param key   Object path (e.g. "jyotisham/userId/sessionId/planets.json")
 * @param data  Any JSON-serializable object
 * @returns     Public URL if R2_PUBLIC_URL is set, otherwise the key
 */
export async function uploadJSON(key: string, data: unknown): Promise<string> {
  const body = JSON.stringify(data);

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: "application/json",
    }),
  );

  return getPublicUrl(key);
}

// ── Download JSON Data ────────────────────────────────────────────────────
/**
 * Retrieve stored JSON from R2.
 *
 * @param key Object path
 * @returns   Parsed JSON, or null if not found
 */
export async function downloadJSON<T = unknown>(
  key: string,
): Promise<T | null> {
  try {
    const response = await r2.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      }),
    );

    const body = await response.Body?.transformToString();
    if (!body) return null;

    return JSON.parse(body) as T;
  } catch (err: any) {
    if (err.name === "NoSuchKey" || err.$metadata?.httpStatusCode === 404) {
      return null;
    }
    throw err;
  }
}

// ── Upload Image / Binary ─────────────────────────────────────────────────
/**
 * Upload an image or any binary file.
 *
 * @param key         Object path (e.g. "images/reports/chart-123.png")
 * @param buffer      File content as Buffer or Uint8Array
 * @param contentType MIME type (default: "image/webp")
 * @returns           Public URL
 */
export async function uploadImage(
  key: string,
  buffer: Buffer | Uint8Array,
  contentType: string = "image/webp",
): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  return getPublicUrl(key);
}

// ── Check if Object Exists ────────────────────────────────────────────────
export async function objectExists(key: string): Promise<boolean> {
  try {
    await r2.send(
      new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }),
    );
    return true;
  } catch {
    return false;
  }
}

// ── Delete Object ─────────────────────────────────────────────────────────
export async function deleteObject(key: string): Promise<void> {
  await r2.send(
    new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }),
  );
}

// ── List Objects by Prefix ────────────────────────────────────────────────
/**
 * List all objects under a given prefix.
 * Useful for finding all stored data for a user/session.
 *
 * @param prefix  Key prefix (e.g. "jyotisham/userId123/")
 * @returns       Array of object keys
 */
export async function listObjects(prefix: string): Promise<string[]> {
  const response = await r2.send(
    new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
    }),
  );

  return (response.Contents || []).map((obj) => obj.Key!).filter(Boolean);
}

// ── Presigned URL (temporary private access) ──────────────────────────────
export async function getPresignedUrl(
  key: string,
  expiresIn: number = 3600,
): Promise<string> {
  return getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }),
    { expiresIn },
  );
}

// ── Public URL Helper ─────────────────────────────────────────────────────
export function getPublicUrl(key: string): string {
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  }
  return key;
}
