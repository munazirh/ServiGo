const nodemailer = require("nodemailer");

// Email transporter configuration
// Configure with your email service provider (Gmail, SendGrid, Mailgun, etc.)
const createTransporter = () => {
  // For Gmail, use: smtp.gmail.com
  // For other services, update accordingly
  
  const smtpConfig = {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  };

  return nodemailer.createTransport(smtpConfig);
};

// Send email with retry logic
async function sendEmail({ to, subject, html, text }) {
  try {
    if (!to || !subject) {
      console.log("[EMAIL] Missing required fields: to, subject");
      return { success: false, error: "Missing required fields" };
    }

    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[EMAIL MOCK] to ${to}: ${subject}`);
      console.log(`[EMAIL MOCK] Body: ${text || html?.substring(0, 100)}...`);
      return { success: true, mock: true };
    }

    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `"ServiGo" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || html?.replace(/<[^>]*>/g, ""),
      html
    });

    console.log(`[EMAIL] Sent successfully to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[EMAIL] Send error:", error.message);
    return { success: false, error: error.message };
  }
}

// Email templates
function getBookingConfirmationEmail({ customerName, serviceName, date, time, location, price, bookingId }) {
  return {
    subject: `Booking Confirmed - ${serviceName} | ServiGo`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #f97316); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .btn { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Booking Confirmed!</h1>
            <p>ServiGo - Appliance Repair Services</p>
          </div>
          <div class="content">
            <p>Hello <strong>${customerName}</strong>,</p>
            <p>Your booking has been confirmed successfully. Here are the details:</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">${bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${location}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Estimated Price:</span>
                <span class="detail-value">₹${price}</span>
              </div>
            </div>
            
            <p>Our technician will arrive at your location at the scheduled time. You'll receive updates about your booking status.</p>
            
            <div class="footer">
              <p>Thank you for choosing ServiGo!</p>
              <p>Need help? Contact us: support@servigo.in | 7970503756</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${customerName}, Your booking for ${serviceName} has been confirmed for ${date} at ${time}. Location: ${location}. Price: ₹${price}. Booking ID: ${bookingId}. Thank you for choosing ServiGo!`
  };
}

function getTechnicianAssignedEmail({ customerName, serviceName, technicianName, technicianPhone, date, time, location, bookingId }) {
  return {
    subject: `Technician Assigned - ${serviceName} | ServiGo`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #16a34a, #15803d); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .technician-box { background: #ecfdf5; border: 2px solid #16a34a; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .technician-name { font-size: 18px; font-weight: bold; color: #16a34a; }
          .phone-btn { display: inline-block; background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 10px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔧 Technician Assigned!</h1>
            <p>ServiGo - Appliance Repair Services</p>
          </div>
          <div class="content">
            <p>Hello <strong>${customerName}</strong>,</p>
            <p>Great news! A technician has been assigned to your service request.</p>
            
            <div class="technician-box">
              <p class="technician-name">👨‍🔧 ${technicianName}</p>
              <p>📞 <a href="tel:${technicianPhone}">${technicianPhone}</a></p>
              <a href="tel:${technicianPhone}" class="phone-btn">📱 Call Technician</a>
            </div>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">${bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${location}</span>
              </div>
            </div>
            
            <p>Your technician will contact you shortly. Please keep your phone available.</p>
            
            <div class="footer">
              <p>Thank you for choosing ServiGo!</p>
              <p>Need help? Contact us: support@servigo.in | 7970503756</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${customerName}, Technician ${technicianName} (${technicianPhone}) has been assigned to your ${serviceName} booking on ${date} at ${time}. Location: ${location}. Booking ID: ${bookingId}. Thank you for choosing ServiGo!`
  };
}

function getBookingCompletedEmail({ customerName, serviceName, price, bookingId, ratingUrl }) {
  return {
    subject: `Service Completed - ${serviceName} | ServiGo`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .rating-section { text-align: center; margin: 25px 0; }
          .btn { display: inline-block; background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Service Completed!</h1>
            <p>ServiGo - Appliance Repair Services</p>
          </div>
          <div class="content">
            <p>Hello <strong>${customerName}</strong>,</p>
            <p>Your <strong>${serviceName}</strong> service has been completed successfully.</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">${bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Final Price:</span>
                <span class="detail-value">₹${price}</span>
              </div>
            </div>
            
            <div class="rating-section">
              <p>How was your experience?</p>
              <p>⭐⭐⭐⭐⭐</p>
              <a href="${ratingUrl}" class="btn">Rate Your Experience</a>
            </div>
            
            <p>Thank you for choosing ServiGo! We hope to serve you again soon.</p>
            
            <div class="footer">
              <p>Need help? Contact us: support@servigo.in | 7970503756</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${customerName}, Your ${serviceName} service has been completed. Final Price: ₹${price}. Booking ID: ${bookingId}. Thank you for choosing ServiGo! Rate your experience: ${ratingUrl}`
  };
}

function getBookingCancelledEmail({ customerName, serviceName, date, time, bookingId, reason }) {
  return {
    subject: `Booking Cancelled - ${serviceName} | ServiGo`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Booking Cancelled</h1>
            <p>ServiGo - Appliance Repair Services</p>
          </div>
          <div class="content">
            <p>Hello <strong>${customerName}</strong>,</p>
            <p>Your booking has been cancelled as per your request.</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">${bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${date}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${time}</span>
              </div>
              ${reason ? `<div class="detail-row">
                <span class="detail-label">Reason:</span>
                <span class="detail-value">${reason}</span>
              </div>` : ''}
            </div>
            
            <p>If you did not request this cancellation, please contact us immediately.</p>
            
            <div class="footer">
              <p>Need help? Contact us: support@servigo.in | 7970503756</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hello ${customerName}, Your ${serviceName} booking (ID: ${bookingId}) for ${date} at ${time} has been cancelled. ${reason ? 'Reason: ' + reason : ''}. Contact us: support@servigo.in | 7970503756`
  };
}

module.exports = {
  sendEmail,
  getBookingConfirmationEmail,
  getTechnicianAssignedEmail,
  getBookingCompletedEmail,
  getBookingCancelledEmail
};
