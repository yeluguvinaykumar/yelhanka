import { NextResponse } from "next/server";
import { getSubscribers, saveSubscribers } from "@/lib/store";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; email?: string };
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();

    if (name.length < 2) {
      return NextResponse.json({ error: "Please share your name." }, { status: 400 });
    }
    if (!EMAIL.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const subscribers = await getSubscribers();
    if (subscribers.some((subscriber) => subscriber.email === email)) {
      return NextResponse.json({
        message: "You're already on the list — thank you for being here.",
      });
    }

    await saveSubscribers([
      {
        id: `sub_${Date.now()}`,
        createdAt: new Date().toISOString(),
        name,
        email,
      },
      ...subscribers,
    ]);

    return NextResponse.json({
      message: "You're on the list. Look out for a note from the pantry soon.",
    });
  } catch {
    return NextResponse.json(
      { error: "We couldn't save your details just now. Please try again." },
      { status: 500 },
    );
  }
}
