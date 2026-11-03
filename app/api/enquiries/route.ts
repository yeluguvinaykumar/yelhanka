import { NextResponse } from "next/server";
import { getEnquiries, saveEnquiries } from "@/lib/store";
import { isAdmin } from "@/lib/admin";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ enquiries: await getEnquiries() });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      subject?: string;
      message?: string;
    };
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    const message = (body.message ?? "").trim();

    if (name.length < 2) {
      return NextResponse.json({ error: "Please share your name." }, { status: 400 });
    }
    if (!EMAIL.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (message.length < 10) {
      return NextResponse.json({ error: "Please add a little more detail to your message." }, { status: 400 });
    }

    const enquiries = await getEnquiries();
    const enquiry = {
      id: `enq_${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: name.slice(0, 120),
      email: email.slice(0, 160),
      phone: (body.phone ?? "").trim().slice(0, 30) || undefined,
      subject: (body.subject ?? "General enquiry").trim().slice(0, 120) || "General enquiry",
      message: message.slice(0, 4000),
      read: false,
    };

    await saveEnquiries([enquiry, ...enquiries]);
    return NextResponse.json({ enquiry, message: "Thank you — your message is with us." });
  } catch {
    return NextResponse.json(
      { error: "We couldn't send your message. Please try WhatsApp instead." },
      { status: 500 },
    );
  }
}
