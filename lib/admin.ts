import "server-only";

import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "./auth";

export async function isAdmin() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export async function requireAdminResponse() {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
