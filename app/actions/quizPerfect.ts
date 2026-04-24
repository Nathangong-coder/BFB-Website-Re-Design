"use server";

export async function sendQuizPerfectEmail(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const year = formData.get("year")?.toString().trim();
  const major = formData.get("major")?.toString().trim();
  const module = formData.get("module")?.toString().trim();

  if (!name || !email || !year || !major) {
    return { success: false, error: "All fields are required." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("Quiz perfect score submission (no email key):", { name, email, year, major, module });
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
        subject: `Perfect Score — ${module} | ${name}`,
        text: `A student achieved a perfect score on the ${module} module.\n\nName: ${name}\nEmail: ${email}\nYear: ${year}\nMajor: ${major}`,
      }),
    });

    if (!res.ok) return { success: false, error: "Failed to send. Please try again." };
    return { success: true };
  } catch {
    return { success: false, error: "Failed to send. Please try again." };
  }
}
