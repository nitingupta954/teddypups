import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { isAdminRequest } from "@/lib/admin-auth";
import { proxy } from "@/proxy";

const basic = (user: string, pass: string) => `Basic ${btoa(`${user}:${pass}`)}`;
const env = { ADMIN_PASSWORD: "s3cret" };

describe("isAdminRequest", () => {
  it("accepts the right credentials (user defaults to admin)", () => {
    expect(isAdminRequest(basic("admin", "s3cret"), env)).toBe(true);
    expect(isAdminRequest(basic("owner", "s3cret"), { ...env, ADMIN_USER: "owner" })).toBe(true);
  });

  it("rejects missing, malformed or wrong credentials", () => {
    expect(isAdminRequest(null, env)).toBe(false);
    expect(isAdminRequest("Bearer abc", env)).toBe(false);
    expect(isAdminRequest("Basic %%%", env)).toBe(false);
    expect(isAdminRequest(`Basic ${btoa("no-colon")}`, env)).toBe(false);
    expect(isAdminRequest(basic("admin", "wrong"), env)).toBe(false);
    expect(isAdminRequest(basic("root", "s3cret"), env)).toBe(false);
  });

  it("is disabled when no password is configured", () => {
    expect(isAdminRequest(basic("admin", ""), {})).toBe(false);
  });
});

describe("proxy on /admin", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("challenges requests without credentials", () => {
    vi.stubEnv("ADMIN_PASSWORD", "s3cret");
    const res = proxy(new NextRequest("http://localhost/admin"));
    expect(res.status).toBe(401);
    expect(res.headers.get("www-authenticate")).toMatch(/^Basic/);
  });

  it("lets valid credentials through", () => {
    vi.stubEnv("ADMIN_PASSWORD", "s3cret");
    const res = proxy(new NextRequest("http://localhost/admin", { headers: { authorization: basic("admin", "s3cret") } }));
    expect(res.status).toBe(200);
  });
});
