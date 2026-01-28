import nodemailer from "nodemailer";

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"GRIND Platform" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw error to prevent blocking the main flow, just log it
    return null;
  }
};

export const educatorRequestTemplate = (data) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
    .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { padding: 20px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #555; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
    .button { display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Educator Request</h1>
    </div>
    <div class="content">
      <p>Hello Admin,</p>
      <p>A new user has requested to become an educator on the GRIND platform. Here are their details:</p>
      
      <div class="field">
        <div class="label">User ID:</div>
        <div>${data.userId}</div>
      </div>
      
      <div class="field">
        <div class="label">Motivation:</div>
        <div>${data.motivation}</div>
      </div>
      
      <div class="field">
        <div class="label">Experience Level:</div>
        <div>${data.experience}</div>
      </div>
      
      <div class="field">
        <div class="label">Areas of Expertise:</div>
        <div>${data.expertise}</div>
      </div>
      
      <div class="field">
        <div class="label">Portfolio:</div>
        <div>${data.portfolio || "N/A"}</div>
      </div>
      
      <div class="field">
          <div class="label">Submitted At:</div>
          <div>${new Date().toLocaleString()}</div>
      </div>

      <a href="#" class="button">Review in Dashboard</a>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} GRIND Platform. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;
};
