export const verificationEmailHTML = (token) => `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
    <h2 style="color: #333;">Verify your email address </h2>
    <p style="font-size: 16px;">Use the code below to verify your email address:</p>
    <p style="font-size: 28px; font-weight: bold; letter-spacing: 10px; color: #2D3748;">
      ${token}
    </p>
    <p style="font-size: 14px; color: #555;">Token is valid for 30 minutes.</p>
    <p style="font-size: 14px; color: #555;">If you didn’t request this, you can safely ignore this email.</p>
  </div>
`;
