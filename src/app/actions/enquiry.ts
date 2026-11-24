"use server";

import { headers } from "next/headers";
import { saveEnquiry } from "@/lib/db";
import { parseEnquiry, type EnquiryState } from "@/lib/enquiry";
import { enquiryLabel, getPuppyById } from "@/lib/puppies";

export async function submitEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  // Honeypot: real people never see or fill the "website" field. Pretend it worked.
  if (form.get("website")) return { ok: true };

  const parsed = parseEnquiry(form);
  if (!parsed.ok) return { ok: false, errors: parsed.errors, message: "Please check the highlighted fields." };

  const puppy = parsed.data.puppyId ? getPuppyById(parsed.data.puppyId) : undefined;
  const source = (await headers()).get("referer") ?? "unknown";
  try {
    await saveEnquiry({ ...parsed.data, puppyLabel: puppy && enquiryLabel(puppy), source });
  } catch (err) {
    console.error("[enquiry] failed to save", err);
    return { ok: false, message: "Sorry, we couldn't send that just now. Please try again or message us on WhatsApp." };
  }
  return { ok: true };
}
