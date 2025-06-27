import { Resend } from "resend";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Init Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to = "c.bhadrala88@gmail.com",
  subject,
  htmlTemplate,
  token,
  category = "Verification Email",
}) => {
  try {
    const finalHTML = htmlTemplate(token);

    const response = await resend.emails.send({
      from: "Authentication App <onboarding@resend.dev>",
      to: "c.bhadrala88@gmail.com",
      subject,
      text: "Your email client does not support HTML.",
      html: finalHTML,
      category,
    });

    console.log("✅ Email sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw new Error("Failed to send email");
  }
};
