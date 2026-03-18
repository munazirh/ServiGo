const Notification = require("../models/Notification");
const http = require("http");
const https = require("https");
const { 
  sendEmail, 
  getBookingConfirmationEmail,
  getTechnicianAssignedEmail,
  getBookingCompletedEmail,
  getBookingCancelledEmail 
} = require("./email");

async function createPortalNotification({ recipientId, title, message, type = "info", meta = {} }) {
  return Notification.create({
    recipient: recipientId,
    title,
    message,
    type,
    meta
  });
}

// SMS integration hook:
// 1) Set SMS_WEBHOOK_URL in env to integrate your provider endpoint.
// 2) If not configured, it logs message (safe local fallback).
async function sendSms({ phone, text }) {
  try {
    if (!phone || !text) return;

    if (!process.env.SMS_WEBHOOK_URL) {
      console.log(`[SMS MOCK] to ${phone}: ${text}`);
      return;
    }

    const payload = JSON.stringify({
      to: phone,
      message: text
    });

    await new Promise((resolve, reject) => {
      const url = new URL(process.env.SMS_WEBHOOK_URL);
      const client = url.protocol === "https:" ? https : http;

      const req = client.request(
        {
          hostname: url.hostname,
          port: url.port || (url.protocol === "https:" ? 443 : 80),
          path: `${url.pathname}${url.search || ""}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(payload)
          }
        },
        (res) => {
          res.on("data", () => {});
          res.on("end", resolve);
        }
      );

      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  } catch (error) {
    console.error("SMS send error:", error.message);
  }
}

// Send booking confirmation email and SMS
async function sendBookingConfirmation({ customerEmail, customerName, customerPhone, serviceName, date, time, location, price, bookingId }) {
  const emailTemplate = getBookingConfirmationEmail({
    customerName,
    serviceName,
    date,
    time,
    location,
    price,
    bookingId: bookingId.toString()
  });
  
  const emailPromise = sendEmail({
    to: customerEmail,
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text
  });

  const smsText = `ServiGo: Your ${serviceName} booking is confirmed for ${date} at ${time}. Location: ${location}. Price: ₹${price}. Thank you!`;
  const smsPromise = sendSms({ phone: customerPhone, text: smsText });

  await Promise.all([emailPromise, smsPromise]);
}

// Send technician assigned email and SMS
async function sendTechnicianAssigned({ customerEmail, customerName, customerPhone, serviceName, technicianName, technicianPhone, date, time, location, bookingId }) {
  const emailTemplate = getTechnicianAssignedEmail({
    customerName,
    serviceName,
    technicianName,
    technicianPhone,
    date,
    time,
    location,
    bookingId: bookingId.toString()
  });

  const emailPromise = sendEmail({
    to: customerEmail,
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text
  });

  const smsText = `ServiGo: Technician ${technicianName} (${technicianPhone}) assigned for your ${serviceName}. Contact: ${technicianPhone}. Booking ID: ${bookingId}`;
  const smsPromise = sendSms({ phone: customerPhone, text: smsText });

  await Promise.all([emailPromise, smsPromise]);
}

// Send booking completed email and SMS
async function sendBookingCompleted({ customerEmail, customerName, customerPhone, serviceName, price, bookingId, ratingUrl }) {
  const emailTemplate = getBookingCompletedEmail({
    customerName,
    serviceName,
    price,
    bookingId: bookingId.toString(),
    ratingUrl
  });

  const emailPromise = sendEmail({
    to: customerEmail,
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text
  });

  const smsText = `ServiGo: Your ${serviceName} service is completed. Final Price: ₹${price}. Thank you for choosing ServiGo!`;
  const smsPromise = sendSms({ phone: customerPhone, text: smsText });

  await Promise.all([emailPromise, smsPromise]);
}

// Send booking cancelled email and SMS
async function sendBookingCancelled({ customerEmail, customerName, customerPhone, serviceName, date, time, bookingId, reason }) {
  const emailTemplate = getBookingCancelledEmail({
    customerName,
    serviceName,
    date,
    time,
    bookingId: bookingId.toString(),
    reason
  });

  const emailPromise = sendEmail({
    to: customerEmail,
    subject: emailTemplate.subject,
    html: emailTemplate.html,
    text: emailTemplate.text
  });

  const smsText = `ServiGo: Your ${serviceName} booking (ID: ${bookingId}) for ${date} at ${time} has been cancelled. ${reason ? 'Reason: ' + reason : ''}.`;
  const smsPromise = sendSms({ phone: customerPhone, text: smsText });

  await Promise.all([emailPromise, smsPromise]);
}

module.exports = {
  createPortalNotification,
  sendSms,
  sendBookingConfirmation,
  sendTechnicianAssigned,
  sendBookingCompleted,
  sendBookingCancelled
};
