import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
  gdpr_consent: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { name, email, subject, message, gdpr_consent }: ContactSubmission = await req.json();

    if (!gdpr_consent) {
      return new Response(
        JSON.stringify({ error: "GDPR consent is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const emailBody = `
Neue Kontaktanfrage von RAIS Website
=====================================

Name: ${name}
E-Mail: ${email}
Betreff: ${subject}

Nachricht:
${message}

---
DSGVO-Einwilligung: Ja
Zeitstempel: ${new Date().toISOString()}
    `.trim();

    console.log("Contact form submission received:");
    console.log(emailBody);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Contact notification logged. Email service can be configured here."
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error processing contact notification:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to process contact notification",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
