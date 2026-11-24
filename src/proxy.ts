import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

// Prompts the browser for credentials on /admin. The admin page re-checks the
// same header itself, so this is the UX layer, not the only line of defence.
export function proxy(request: NextRequest) {
  if (isAdminRequest(request.headers.get("authorization"))) return NextResponse.next();
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="TeddyPups admin", charset="UTF-8"' },
  });
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
