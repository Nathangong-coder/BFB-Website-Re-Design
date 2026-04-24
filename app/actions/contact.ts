"use server";

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!name || !email || !message) {
    return { success: false, error: "All fields are required." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Fallback: log so the site doesn't break without RESEND_API_KEY configured
    console.log("Contact form submission (no email key configured):", { name, email, message });
    return { success: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "BFB Website <onboarding@resend.dev>",
        to: "bfbatucla@gmail.com",
        reply_to: email,
        subject: `BFB inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      }),
    });

    if (!res.ok) {
      return { success: false, error: "Failed to send. Please try again." };
    }
    return { success: true };
  } catch {
    return { success: false, error: "Failed to send. Please try again." };
  }
}
