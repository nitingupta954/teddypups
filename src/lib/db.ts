import "server-only";
import { neon } from "@neondatabase/serverless";
import type { Enquiry } from "@/lib/enquiry";

// Neon's HTTP driver: one fetch per query, no pool to manage in serverless functions.
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

export type StoredEnquiry = Enquiry & { id: number; createdAt: string; puppyLabel?: string; source: string };

export async function saveEnquiry(e: Enquiry & { puppyLabel?: string; source: string }) {
  if (!sql) {
    // No database configured: fine while developing, a hard error in production
    // so an enquiry is never silently dropped.
    if (process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is not set");
    console.info("[enquiry] DATABASE_URL not set, not persisted:", e);
    return;
  }
  await sql`
    INSERT INTO enquiries (name, phone, email, area, message, puppy_id, puppy_label, source)
    VALUES (${e.name}, ${e.phone}, ${e.email ?? null}, ${e.area ?? null}, ${e.message ?? null},
            ${e.puppyId ?? null}, ${e.puppyLabel ?? null}, ${e.source})`;
}

export async function listEnquiries(limit = 200): Promise<StoredEnquiry[]> {
  if (!sql) return [];
  const rows = await sql`
    SELECT id, created_at, name, phone, email, area, message, puppy_id, puppy_label, source
    FROM enquiries ORDER BY created_at DESC LIMIT ${limit}`;
  return rows.map((r) => ({
    id: Number(r.id),
    createdAt: new Date(r.created_at).toISOString(),
    name: r.name,
    phone: r.phone,
    email: r.email ?? undefined,
    area: r.area ?? undefined,
    message: r.message ?? undefined,
    puppyId: r.puppy_id ?? undefined,
    puppyLabel: r.puppy_label ?? undefined,
    source: r.source,
  }));
}
