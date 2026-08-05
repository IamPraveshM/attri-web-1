import { getDb } from "../db";

const supabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const secret = () => process.env.SUPABASE_SECRET_KEY || "";
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "client-files";

function storageUrl(key: string) {
  return `${supabaseUrl()}/storage/v1/object/${bucketName}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

const BUCKET = {
  async put(key: string, body: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }) {
    const response = await fetch(storageUrl(key), { method: "POST", headers: { Authorization: `Bearer ${secret()}`, apikey: secret(), "Content-Type": options?.httpMetadata?.contentType || "application/octet-stream", "x-upsert": "true" }, body });
    if (!response.ok) throw new Error(`Supabase Storage upload failed (${response.status})`);
  },
  async get(key: string) {
    const response = await fetch(storageUrl(key), { headers: { Authorization: `Bearer ${secret()}`, apikey: secret() } });
    if (!response.ok) return null;
    return { body: response.body, httpMetadata: { contentType: response.headers.get("content-type") || "application/octet-stream" } };
  },
  async delete(key: string) {
    await fetch(storageUrl(key), { method: "DELETE", headers: { Authorization: `Bearer ${secret()}`, apikey: secret() } });
  },
};

export const env = { DB: getDb(), BUCKET };
export class WorkerEntrypoint {}
export class DurableObject {}
export class WorkflowEntrypoint {}
