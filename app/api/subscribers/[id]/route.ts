import { NextResponse } from "next/server";
import { getSubscribers, saveSubscribers } from "@/lib/store";
import { isAdmin } from "@/lib/admin";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const subscribers = await getSubscribers();
  const next = subscribers.filter((item) => item.id !== id);
  if (next.length === subscribers.length) {
    return NextResponse.json({ error: "Subscriber not found." }, { status: 404 });
  }
  await saveSubscribers(next);
  return NextResponse.json({ ok: true });
}
