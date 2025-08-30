import twilio from "twilio";

// Initialize Twilio client only if credentials are available
let client = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  } catch (error) {
    console.warn("Failed to initialize Twilio client:", error.message);
  }
}

// Send SMS
export const sendSMS = async ({ to, message, from = null }) => {
  try {
    // Check if Twilio client is available
    if (!client) {
      console.warn("Twilio client not configured, SMS functionality disabled");
      return {
        success: false,
        message: "SMS service not configured",
        error: "Twilio credentials not provided",
      };
    }

    const twilioFrom = from || process.env.TWILIO_PHONE_NUMBER;

    if (!twilioFrom) {
      throw new Error("Twilio phone number not configured");
    }

    const result = await client.messages.create({
      body: message,
      from: twilioFrom,
      to: to,
    });

    console.log("SMS sent successfully:", {
      messageId: result.sid,
      to,
      from: twilioFrom,
      status: result.status,
    });

    return {
      success: true,
      messageId: result.sid,
      status: result.status,
    };
  } catch (error) {
    console.error("Failed to send SMS:", error);
    throw error;
  }
};

// Send welcome SMS
export const sendWelcomeSMS = async (phone, name) => {
  const message = `Karibu Nurtura! Welcome ${name}. Your account has been created successfully. You can now log in to access your dashboard.`;

  return sendSMS({
    to: phone,
    message,
  });
};

// Send password reset SMS
export const sendPasswordResetSMS = async (phone, resetToken) => {
  const message = `Your Nurtura password reset code is: ${resetToken}. This code expires in 10 minutes. Do not share this code with anyone.`;

  return sendSMS({
    to: phone,
    message,
  });
};

// Send attendance notification SMS
export const sendAttendanceNotificationSMS = async (
  phone,
  childName,
  status,
  time
) => {
  const statusText = status === "in" ? "checked in" : "checked out";
  const message = `${childName} has ${statusText} at ${time}. Thank you for using Nurtura!`;

  return sendSMS({
    to: phone,
    message,
  });
};

// Send emergency alert SMS
export const sendEmergencyAlertSMS = async (phones, emergency) => {
  const message = `EMERGENCY ALERT: ${emergency.type} at ${emergency.location}. ${emergency.description}. Please follow instructions: ${emergency.instructions}`;

  const results = [];

  for (const phone of phones) {
    try {
      const result = await sendSMS({
        to: phone,
        message,
      });
      results.push({
        phone,
        success: true,
        result,
      });
    } catch (error) {
      results.push({
        phone,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
};

// Send payment reminder SMS
export const sendPaymentReminderSMS = async (phone, amount, dueDate) => {
  const message = `Payment Reminder: Your payment of ${amount} is due on ${dueDate}. Please log in to Nurtura to make your payment.`;

  return sendSMS({
    to: phone,
    message,
  });
};

// Send daily report SMS
export const sendDailyReportSMS = async (phone, childName, summary) => {
  const message = `Daily Report for ${childName}: ${summary}. Log in to Nurtura for full details.`;

  return sendSMS({
    to: phone,
    message,
  });
};

// Send event reminder SMS
export const sendEventReminderSMS = async (phones, event) => {
  const message = `Event Reminder: ${event.title} on ${event.date} at ${event.time}. Location: ${event.location}`;

  const results = [];

  for (const phone of phones) {
    try {
      const result = await sendSMS({
        to: phone,
        message,
      });
      results.push({
        phone,
        success: true,
        result,
      });
    } catch (error) {
      results.push({
        phone,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
};

// Send bulk SMS
export const sendBulkSMS = async (recipients, message) => {
  const results = [];

  for (const recipient of recipients) {
    try {
      const result = await sendSMS({
        to: recipient.phone,
        message: message.replace("{{name}}", recipient.name || ""),
      });
      results.push({
        phone: recipient.phone,
        success: true,
        result,
      });
    } catch (error) {
      results.push({
        phone: recipient.phone,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
};

// Send voice call (for important notifications)
export const sendVoiceCall = async ({ to, message, from = null }) => {
  try {
    const twilioFrom = from || process.env.TWILIO_PHONE_NUMBER;

    if (!twilioFrom) {
      throw new Error("Twilio phone number not configured");
    }

    // Convert message to speech-friendly format
    const speechMessage = message
      .replace(/[^\w\s]/g, " ") // Remove special characters
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();

    const result = await client.calls.create({
      twiml: `<Response><Say>${speechMessage}</Say></Response>`,
      from: twilioFrom,
      to: to,
    });

    console.log("Voice call initiated successfully:", {
      callId: result.sid,
      to,
      from: twilioFrom,
      status: result.status,
    });

    return {
      success: true,
      callId: result.sid,
      status: result.status,
    };
  } catch (error) {
    console.error("Failed to initiate voice call:", error);
    throw error;
  }
};

// Send WhatsApp message (if Twilio supports it)
export const sendWhatsApp = async ({ to, message, from = null }) => {
  try {
    const twilioFrom = from || `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`;

    if (!twilioFrom) {
      throw new Error("Twilio WhatsApp number not configured");
    }

    // Format phone number for WhatsApp
    const whatsappTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

    const result = await client.messages.create({
      body: message,
      from: twilioFrom,
      to: whatsappTo,
    });

    console.log("WhatsApp message sent successfully:", {
      messageId: result.sid,
      to: whatsappTo,
      from: twilioFrom,
      status: result.status,
    });

    return {
      success: true,
      messageId: result.sid,
      status: result.status,
    };
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
    throw error;
  }
};

// Test SMS service
export const testSMSService = async () => {
  try {
    // Test with a simple message to verify credentials
    const testPhone = process.env.TEST_PHONE_NUMBER;

    if (!testPhone) {
      console.log("SMS service test skipped - no test phone number configured");
      return true;
    }

    const result = await sendSMS({
      to: testPhone,
      message: "This is a test message from Nurtura SMS service.",
    });

    console.log("SMS service test successful:", result);
    return true;
  } catch (error) {
    console.error("SMS service test failed:", error);
    return false;
  }
};

// Get SMS delivery status
export const getSMSStatus = async (messageId) => {
  try {
    const message = await client.messages(messageId).fetch();

    return {
      messageId: message.sid,
      status: message.status,
      sentAt: message.dateCreated,
      deliveredAt: message.dateUpdated,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage,
    };
  } catch (error) {
    console.error("Failed to get SMS status:", error);
    throw error;
  }
};

// Get SMS history
export const getSMSHistory = async (options = {}) => {
  try {
    const {
      limit = 50,
      pageSize = 20,
      status = null,
      from = null,
      to = null,
      startDate = null,
      endDate = null,
    } = options;

    let messages = await client.messages.list({
      limit,
      pageSize,
      status,
      from,
      to,
      dateSentAfter: startDate,
      dateSentBefore: endDate,
    });

    return messages.map((message) => ({
      messageId: message.sid,
      from: message.from,
      to: message.to,
      body: message.body,
      status: message.status,
      sentAt: message.dateCreated,
      deliveredAt: message.dateUpdated,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage,
    }));
  } catch (error) {
    console.error("Failed to get SMS history:", error);
    throw error;
  }
};
