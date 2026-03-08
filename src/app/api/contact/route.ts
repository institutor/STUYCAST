import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, grade, interests, message } = data;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // TODO: Send notification email to club organizers
    // TODO: Store submission in database
    console.log("New join application:", { name, email, grade, interests, message });

    return NextResponse.json({ success: true, message: "Application submitted" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
