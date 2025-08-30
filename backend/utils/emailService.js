import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create transporter
const createTransporter = () => {
  // Check if required email credentials are available
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("Email credentials not configured. Emails will not be sent.");
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Load email template
const loadTemplate = (templateName, context) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../templates/emails",
      `${templateName}.html`
    );

    if (!fs.existsSync(templatePath)) {
      // If template doesn't exist, create a simple fallback
      console.log(`Template ${templateName} not found, using fallback`);
      return createFallbackTemplate(templateName, context);
    }

    let template = fs.readFileSync(templatePath, "utf8");

    // Replace placeholders with context values
    Object.keys(context).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      template = template.replace(regex, context[key]);
    });

    return template;
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    // Return fallback template if there's an error
    return createFallbackTemplate(templateName, context);
  }
};

// Create fallback template when the actual template is missing
const createFallbackTemplate = (templateName, context) => {
  switch (templateName) {
    case "center-welcome":
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Welcome to Nurtura!</h2>
          <p>Hello ${context.name || 'there'},</p>
          <p>Your daycare center <strong>${context.centerName || 'Center'}</strong> has been successfully registered on Nurtura!</p>
          <p>You can now log in to your admin dashboard using your email: <strong>${context.adminEmail || 'your email'}</strong></p>
          <p>Thank you for choosing Nurtura for your daycare management needs.</p>
          <br>
          <p>Best regards,<br>The Nurtura Team</p>
        </div>
      `;
    case "welcome":
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Welcome to Nurtura!</h2>
          <p>Hello ${context.name || 'there'},</p>
          <p>Welcome to Nurtura! Your account has been created successfully.</p>
          <p>Role: <strong>${context.role || 'User'}</strong></p>
          <p>You can now log in to your account and start using our services.</p>
          <br>
          <p>Best regards,<br>The Nurtura Team</p>
        </div>
      `;
    case "user-welcome":
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Welcome to ${context.centerName || 'Nurtura'}!</h2>
          <p>Hello ${context.name || 'there'},</p>
          <p>Your account has been created successfully by ${context.adminName || 'an administrator'}.</p>
          <p>Role: <strong>${context.role || 'User'}</strong></p>
          <p>Center: <strong>${context.centerName || 'Nurtura'}</strong></p>
          <p>Your temporary password is: <strong style="background-color: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${context.temporaryPassword || 'TEMP_PASSWORD'}</strong></p>
          <p><strong>Important:</strong> Please change your password after your first login for security.</p>
          <p>You can now log in to your account at: <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/login" style="color: #2563eb;">Login Page</a></p>
          <br>
          <p>Best regards,<br>The ${context.centerName || 'Nurtura'} Team</p>
        </div>
      `;
    default:
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Nurtura Notification</h2>
          <p>Hello,</p>
          <p>This is a notification from Nurtura.</p>
          <br>
          <p>Best regards,<br>The Nurtura Team</p>
        </div>
      `;
  }
};

// Send email
export const sendEmail = async ({
  to,
  subject,
  template,
  context = {},
  attachments = [],
}) => {
  try {
    const transporter = createTransporter();

    // If no transporter (email not configured), log and return success
    if (!transporter) {
      console.log("Email not configured, skipping email send:", { to, subject, template });
      return {
        success: true,
        messageId: "email-not-configured",
        skipped: true,
      };
    }

    // Load and process template
    let htmlContent = "";
    if (template) {
      htmlContent = loadTemplate(template, context);
      if (!htmlContent) {
        throw new Error(`Failed to load template: ${template}`);
      }
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html: htmlContent,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", {
      messageId: info.messageId,
      to,
      subject,
      template,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: "Welcome to Nurtura!",
    template: "welcome",
    context: {
      name: user.firstName,
      role: user.role,
      language: user.preferredLanguage,
      loginUrl: `${process.env.FRONTEND_URL}/auth/login`,
    },
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (user, resetToken) => {
  return sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    template: "password-reset",
    context: {
      name: user.firstName,
      resetToken,
      resetUrl: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`,
      expiryTime: "10 minutes",
    },
  });
};

// Send password reset confirmation email
export const sendPasswordResetConfirmationEmail = async (user) => {
  return sendEmail({
    to: user.email,
    subject: "Password Reset Successful",
    template: "password-reset-success",
    context: {
      name: user.firstName,
      loginUrl: `${process.env.FRONTEND_URL}/auth/login`,
    },
  });
};

// Send email verification email
export const sendEmailVerificationEmail = async (user, verificationToken) => {
  return sendEmail({
    to: user.email,
    subject: "Verify Your Email Address",
    template: "email-verification",
    context: {
      name: user.firstName,
      verificationToken,
      verificationUrl: `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`,
      expiryTime: "24 hours",
    },
  });
};

// Send daily report email
export const sendDailyReportEmail = async (user, child, report) => {
  return sendEmail({
    to: user.email,
    subject: `Daily Report for ${child.firstName}`,
    template: "daily-report",
    context: {
      parentName: user.firstName,
      childName: child.firstName,
      date: new Date().toLocaleDateString(),
      activities: report.activities,
      meals: report.meals,
      naps: report.naps,
      mood: report.mood,
      notes: report.notes,
    },
  });
};

// Send payment reminder email
export const sendPaymentReminderEmail = async (user, payment) => {
  return sendEmail({
    to: user.email,
    subject: "Payment Reminder",
    template: "payment-reminder",
    context: {
      name: user.firstName,
      amount: payment.amount,
      dueDate: payment.dueDate,
      paymentUrl: `${process.env.FRONTEND_URL}/payments/${payment._id}`,
      invoiceNumber: payment.invoiceNumber,
    },
  });
};

// Send emergency alert email
export const sendEmergencyAlertEmail = async (users, emergency) => {
  const emails = users.map((user) => user.email);

  return sendEmail({
    to: emails.join(", "),
    subject: "Emergency Alert - Nurtura",
    template: "emergency-alert",
    context: {
      emergencyType: emergency.type,
      description: emergency.description,
      location: emergency.location,
      time: emergency.time,
      instructions: emergency.instructions,
    },
  });
};

// Send event reminder email
export const sendEventReminderEmail = async (users, event) => {
  const emails = users.map((user) => user.email);

  return sendEmail({
    to: emails.join(", "),
    subject: `Event Reminder: ${event.title}`,
    template: "event-reminder",
    context: {
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location,
      eventDescription: event.description,
    },
  });
};

// Send bulk email
export const sendBulkEmail = async (
  recipients,
  subject,
  template,
  context = {}
) => {
  try {
    const transporter = createTransporter();
    
    // If no transporter (email not configured), log and return success
    if (!transporter) {
      console.log("Email not configured, skipping bulk email send:", { subject, template, recipientCount: recipients.length });
      return recipients.map(recipient => ({
        email: recipient.email,
        success: true,
        messageId: "email-not-configured",
        skipped: true,
      }));
    }
    
    const results = [];

    for (const recipient of recipients) {
      try {
        const htmlContent = loadTemplate(template, {
          ...context,
          ...recipient,
        });

        const mailOptions = {
          from: process.env.SMTP_USER,
          to: recipient.email,
          subject,
          html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        results.push({
          email: recipient.email,
          success: true,
          messageId: info.messageId,
        });
      } catch (error) {
        results.push({
          email: recipient.email,
          success: false,
          error: error.message,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Failed to send bulk email:", error);
    throw error;
  }
};

// Test email service
export const testEmailService = async () => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log("Email service not configured");
      return false;
    }
    
    await transporter.verify();
    console.log("Email service is ready");
    return true;
  } catch (error) {
    console.error("Email service test failed:", error);
    return false;
  }
};
