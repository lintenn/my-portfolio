import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.formData();

  const name = body.get("name")?.toString();
  const email = body.get("email")?.toString();
  const message = body.get("message")?.toString();

  const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT;

  if (!formspreeEndpoint) {
    return NextResponse.json(
      { error: "Formspree endpoint is not defined" },
      { status: 500 }
    );
  }

  const formData = new URLSearchParams();
  formData.append("name", name || "");
  formData.append("email", email || "");
  formData.append("message", message || "");

  try {
    const response = await fetch(`https://formspree.io/f/${formspreeEndpoint}`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
