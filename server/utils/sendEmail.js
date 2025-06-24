// server/utils/mailtrapClient.js
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Init Mailtrap client
const client = new MailtrapClient({
  token: process.env.MAILTRAP_API_KEY,
});

// Default sender
const sender = {
  email: "hello@demomailtrap.co",
  name: "Authentication App",
};

/**
 * Sends an email using Mailtrap
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.htmlTemplate - HTML template string with {token}
 * @param {string} options.token - Token to inject in template
 * @param {string} options.category - Email category (optional)
 */
export const sendEmail = async ({
  to = "c.bhadrala88@gmail.com",
  subject,
  htmlTemplate,
  token,
  category = "Verification Email",
}) => {
  try {
    const finalHTML = htmlTemplate(token);

    const response = await client.send({
      from: sender,
      to: [{ email: to.toLowerCase() }],
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
