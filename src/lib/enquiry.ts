import { z } from "zod";
import { puppies } from "@/lib/puppies";

const optionalText = (max: number) =>
  z.string().trim().max(max, `Please keep this under ${max} characters.`).optional().transform((v) => v || undefined);

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(80, "That name is a little long."),
  // Loose on purpose: people type "+971 50 123 4567", "050-123-4567", "(050) 1234567"...
  phone: z
    .string()
    .trim()
    .min(1, "Please add a phone or WhatsApp number.")
    .regex(/^\+?[\d\s()-]+$/, "Please use digits only, e.g. +971 50 123 4567.")
    .refine((v) => {
      const digits = v.replace(/\D/g, "").length;
      return digits >= 7 && digits <= 15;
    }, "Please include your full number with country code."),
  email: z
    .union([z.literal(""), z.email("That email doesn't look right.")])
    .optional()
    .transform((v) => v || undefined),
  area: optionalText(80),
  message: optionalText(2000),
  puppyId: z
    .string()
    .optional()
    .transform((v) => v || undefined)
    .refine((v) => !v || puppies.some((p) => p.id === v), "Please pick a puppy from the list."),
});

export type Enquiry = z.output<typeof enquirySchema>;
export type EnquiryField = keyof z.input<typeof enquirySchema>;

export type EnquiryState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<EnquiryField, string>>;
};

export function parseEnquiry(form: FormData):
  | { ok: true; data: Enquiry }
  | { ok: false; errors: EnquiryState["errors"] } {
  const raw = Object.fromEntries(
    (["name", "phone", "email", "area", "message", "puppyId"] as const).map((k) => [k, form.get(k) ?? ""]),
  );
  const result = enquirySchema.safeParse(raw);
  if (result.success) return { ok: true, data: result.data };
  const errors: EnquiryState["errors"] = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as EnquiryField;
    errors[key] ??= issue.message;
  }
  return { ok: false, errors };
}
