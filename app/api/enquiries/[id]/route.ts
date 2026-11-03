import { NextResponse } from "next/server";
import { getEnquiries, saveEnquiries } from "@/lib/store";
import { isAdmin } from "@/lib/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = (await request.json()) as { read?: boolean };
    const enquiries = await getEnquiries();
    const index = enquiries.findIndex((item) => item.id === id);
    if (index < 0) {
      return NextResponse.json({ error: "Enquiry not found." }, { status: 404 });
    }
    enquiries[index] = { ...enquiries[index], read: Boolean(body.read) };
    await saveEnquiries(enquiries);
    return NextResponse.json({ enquiry: enquiries[index] });
  } catch {
    return NextResponse.json({ error: "Could not update enquiry." }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const enquiries = await getEnquiries();
  await saveEnquiries(enquiries.filter((item) => item.id !== id));
  return NextResponse.json({ ok: true });
}
