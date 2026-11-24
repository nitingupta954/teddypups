import { describe, expect, it } from "vitest";
import { parseEnquiry } from "@/lib/enquiry";
import { availablePuppies } from "@/lib/puppies";

const form = (fields: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
};

describe("parseEnquiry", () => {
  it("accepts a minimal enquiry and drops empty optional fields", () => {
    const r = parseEnquiry(form({ name: "Aisha", phone: "+971 50 123 4567", email: "", area: "", message: "" }));
    expect(r).toEqual({ ok: true, data: { name: "Aisha", phone: "+971 50 123 4567" } });
  });

  it("keeps optional fields and a real puppy id", () => {
    const id = availablePuppies[0].id;
    const r = parseEnquiry(form({ name: "Aisha", phone: "050-123-4567", email: "a@b.co", area: "Dubai Marina", message: "Hi", puppyId: id }));
    expect(r.ok && r.data).toMatchObject({ email: "a@b.co", area: "Dubai Marina", message: "Hi", puppyId: id });
  });

  it("reports one message per invalid field", () => {
    const r = parseEnquiry(form({ name: "A", phone: "call me", email: "nope" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors!).sort()).toEqual(["email", "name", "phone"]);
  });

  it("rejects too-short numbers and unknown puppies", () => {
    const r = parseEnquiry(form({ name: "Aisha", phone: "12345", puppyId: "not-a-puppy" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors!).sort()).toEqual(["phone", "puppyId"]);
  });

  it("requires name and phone", () => {
    const r = parseEnquiry(form({}));
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(Object.keys(r.errors!).sort()).toEqual(["name", "phone"]);
      expect(r.errors!.phone).toBe("Please add a phone or WhatsApp number.");
    }
  });
});
